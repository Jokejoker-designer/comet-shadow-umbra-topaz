/** Isolated write handle so store.ts does not import serial.ts (cycle). */

let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
let getWritable: (() => WritableStream<Uint8Array> | null | undefined) | null = null;

export function bindSerialWritable(fn: () => WritableStream<Uint8Array> | null | undefined) {
  getWritable = fn;
}

export function releaseSerialWriter() {
  try {
    writer?.releaseLock();
  } catch {
    /* */
  }
  writer = null;
}

export async function writeSerial(bytes: Uint8Array): Promise<boolean> {
  const stream = getWritable?.();
  if (!stream) return false;
  try {
    if (!writer) writer = stream.getWriter();
    await writer.write(bytes);
    return true;
  } catch {
    releaseSerialWriter();
    return false;
  }
}
