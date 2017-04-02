import { imul, smi } from './Math';

// http://jsperf.com/hashing-strings
export function hashString(str: string) {
  // This is the hash from JVM
  // The hash code for a string is computed as
  // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
  // where s[i] is the ith character of the string and n is the length of
  // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
  // (exclusive) by dropping high bits.
  let hash = 0;
  for (let ii = 0; ii < str.length; ii++) {
    hash = 31 * hash + str.charCodeAt(ii) | 0;
  }
  return smi(hash);
}

export function murmurHashOfSize(size: number, h: number) {
  h = imul(h, 0xCC9E2D51);
  h = imul(h << 15 | h >>> -15, 0x1B873593);
  h = imul(h << 13 | h >>> -13, 5);
  h = (h + 0xE6546B64 | 0) ^ size;
  h = imul(h ^ h >>> 16, 0x85EBCA6B);
  h = imul(h ^ h >>> 13, 0xC2B2AE35);
  h = smi(h ^ h >>> 16);
  return h;
}

export function hashMerge(a: number, b: number) {
  return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
}
