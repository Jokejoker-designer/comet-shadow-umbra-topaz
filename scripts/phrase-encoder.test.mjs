import assert from "node:assert/strict";
import test from "node:test";

function rotl8(value, shift) {
  const s = shift & 7;
  const v = value & 0xff;
  return ((v << s) | (v >> (8 - s))) & 0xff;
}
function stepCtx(ctx, stim) {
  return rotl8(ctx, 3) ^ (stim & 0xff) ^ rotl8(stim, 2);
}
function encodeTokens(text) {
  const data = new TextEncoder().encode(text);
  const acc = [0, 0, 0];
  data.forEach((byte, i) => {
    acc[i % 3] = stepCtx(acc[i % 3], byte);
  });
  const n = data.length & 0xff;
  acc[0] = stepCtx(acc[0], n);
  acc[1] = stepCtx(acc[1], rotl8(n, 3));
  acc[2] = stepCtx(acc[2], rotl8(n, 5));
  return acc;
}

test("host encoder matches silicon golden tokens", () => {
  assert.deepEqual(encodeTokens("xin chào"), [80, 90, 238]);
  assert.deepEqual(encodeTokens("Tên tôi là Quân"), [30, 10, 40]);
  assert.deepEqual(encodeTokens("Xin chào"), [17, 90, 238]);
  assert.deepEqual(encodeTokens("Tôi tên gì?"), [57, 125, 120]);
});
