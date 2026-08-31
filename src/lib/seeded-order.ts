// Deterministic option shuffling, shared by the client players and the
// server-side test-out grader.
//
// The players hold the source index in state and render in `seededOrder`;
// the test-out API does the inverse — it ships options ALREADY reordered and
// keeps `answer` on the server, so the client posts a display position and
// the route maps it back. Same permutation on both sides, one implementation.

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A permutation of `0..length-1`, stable for a given seed. */
export function seededOrder(length: number, seed: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  let s = seed || 1;
  for (let i = length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
