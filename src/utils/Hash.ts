import { imul, smi } from './Math'

export function murmurHashOfSize(size, h) {
  h = imul(h, 0xCC9E2D51)
  h = imul(h << 15 | h >>> -15, 0x1B873593)
  h = imul(h << 13 | h >>> -13, 5)
  h = (h + 0xE6546B64 | 0) ^ size
  h = imul(h ^ h >>> 16, 0x85EBCA6B)
  h = imul(h ^ h >>> 13, 0xC2B2AE35)
  h = smi(h ^ h >>> 16)
  return h
}

export function hashMerge(a, b) {
  return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0 // int
}
