#!/usr/bin/env python3
"""Forward Basys3 UART lines to stdout (and optionally a websocket later).

Usage (Windows):
  pip install pyserial
  python tools/uart_bridge.py COM8

Usage (Linux):
  python tools/uart_bridge.py /dev/ttyUSB1

The graph app prefers Web Serial in Chrome. Use this script when you want a
PowerShell-style capture, or to confirm the board is talking at 115200 8N1.
"""
from __future__ import annotations

import argparse
import sys
import time


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("port", help="COM8 or /dev/ttyUSB1")
    parser.add_argument("--baud", type=int, default=115200)
    args = parser.parse_args()

    try:
        import serial  # type: ignore
    except ImportError:
        print("pip install pyserial", file=sys.stderr)
        return 2

    ser = serial.Serial(args.port, args.baud, timeout=0.2)
    print(f"# opened {args.port} @ {args.baud}", file=sys.stderr)
    try:
        while True:
            line = ser.readline()
            if not line:
                time.sleep(0.01)
                continue
            text = line.decode("utf-8", errors="replace").rstrip()
            if text:
                print(text, flush=True)
    except KeyboardInterrupt:
        return 0
    finally:
        ser.close()


if __name__ == "__main__":
    raise SystemExit(main())
