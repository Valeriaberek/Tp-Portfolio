import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

const wav = readFileSync(new URL('../public/audio/island-lofi.wav', import.meta.url))

test('le morceau est un fichier WAV PCM mono utilisable par le lecteur', () => {
  expect(wav.toString('ascii', 0, 4)).toBe('RIFF')
  expect(wav.toString('ascii', 8, 12)).toBe('WAVE')
  expect(wav.readUInt16LE(20)).toBe(1)
  expect(wav.readUInt16LE(22)).toBe(1)
  expect(wav.readUInt16LE(34)).toBe(16)
  expect(wav.readUInt32LE(40)).toBe(wav.length - 44)
  const duration = (wav.length - 44) / wav.readUInt32LE(28)
  expect(duration).toBeGreaterThan(20)
  expect(duration).toBeLessThan(30)
})

test('le signal contient de la musique et garde une marge avant saturation', () => {
  let peak = 0
  for (let index = 44; index < wav.length; index += 2) {
    peak = Math.max(peak, Math.abs(wav.readInt16LE(index)))
  }
  expect(peak).toBeGreaterThan(1000)
  expect(peak).toBeLessThan(30000)
})

test('le raccord de boucle ne présente pas de saut important entre les échantillons', () => {
  const first = wav.readInt16LE(44)
  const last = wav.readInt16LE(wav.length - 2)
  expect(Math.abs(first - last)).toBeLessThan(1500)
})
