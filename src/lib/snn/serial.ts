import { FrameScanner, decodeAny, parseUartLine, pulseFromFrames } from "./parse-uart";
import { useLab } from "./store";

type SerialPortLike = {
  open: (opts: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
};

type SerialNav = {
  requestPort: (opts?: { filters?: Array<{ usbVendorId?: number }> }) => Promise<SerialPortLike>;
};

export function hasWebSerial(): boolean {
  return typeof navigator !== "undefined" && Boolean((navigator as Navigator & { serial?: SerialNav }).serial);
}

let activePort: SerialPortLike | null = null;
let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
let session = 0;

async function releaseReader() {
  const cur = reader;
  reader = null;
  try {
    await cur?.cancel();
  } catch {
    /* */
  }
  try {
    cur?.releaseLock();
  } catch {
    /* */
  }
}

export async function disconnectWebSerial() {
  session += 1;
  await releaseReader();
  const port = activePort;
  activePort = null;
  try {
    await port?.close();
  } catch {
    /* */
  }
  if (useLab.getState().source === "board") useLab.getState().detachBoard();
}

export async function connectWebSerial(baudRate = 115200) {
  const serial = (navigator as Navigator & { serial?: SerialNav }).serial;
  if (!serial) throw new Error("Cần Chrome/Edge — Web Serial.");
  const my = ++session;
  await releaseReader();
  const port = await serial.requestPort({ filters: [] });
  if (session !== my) return;
  if (!port.readable) {
    try {
      await port.open({ baudRate });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!/already open/i.test(msg)) {
        throw /failed to open|NetworkError/i.test(msg)
          ? new Error("COM8 đang bị giữ (PuTTY / tab cũ / Vivado). Đóng rồi Connect lại.")
          : err;
      }
    }
  }
  if (session !== my) return;
  activePort = port;
  useLab.getState().attachBoard("COM8", baudRate);
  const stream = port.readable;
  if (!stream) {
    useLab.getState().setSerialError("Cổng mở nhưng không đọc được.");
    return;
  }
  try {
    reader = stream.getReader();
  } catch {
    useLab.getState().setSerialError("Luồng COM8 bị khóa. Refresh rồi Connect lại.");
    return;
  }
  const scanner = new FrameScanner();
  void (async () => {
    try {
      while (session === my && reader) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value || session !== my) continue;
        useLab.getState().markRx(value.byteLength);
        const frames = scanner.push(value);
        if (frames.length === 0 && useLab.getState().rxLines === 0) {
          const hex = [...value]
            .slice(0, 24)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(" ");
          useLab.getState().noteRaw(hex);
        }
        for (const raw of frames) {
          const prev = useLab.getState().frame;
          const next = decodeAny(raw, prev);
          if (next) useLab.getState().ingest(next, pulseFromFrames(prev, next));
        }
      }
    } catch (err) {
      if (session === my) useLab.getState().setSerialError(err instanceof Error ? err.message : String(err));
    }
  })();
}

export function ingestPastedLog(text: string): number {
  let n = 0;
  let prev = useLab.getState().frame;
  useLab.getState().attachBoard("UART log", 115200);
  for (const line of text.split(/\r?\n/)) {
    const next = parseUartLine(line, prev);
    if (!next) continue;
    useLab.getState().ingest(next, pulseFromFrames(prev, next));
    prev = next;
    n += 1;
  }
  return n;
}
