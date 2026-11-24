import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'

const sampleRate = 22050
const beat = 60 / 76
const bar = beat * 4
const samples = new Float64Array(Math.round(bar * 8 * sampleRate))
let randomSeed = 2026

function randomNoise() {
  randomSeed = (Math.imul(randomSeed, 1664525) + 1013904223) >>> 0
  return (randomSeed / 4294967296) * 2 - 1
}

function mix(start, duration, sound) {
  const firstSample = Math.round(start * sampleRate)
  for (let frame = 0; frame < duration * sampleRate; frame++) {
    // Les queues des notes reviennent au début pour conserver une boucle continue.
    const index = (firstSample + frame) % samples.length
    samples[index] += sound(frame / sampleRate)
  }
}

function note(start, frequency, duration, volume) {
  mix(start, duration, (time) => {
    const phase = 2 * Math.PI * frequency * time
    const tone = Math.sin(phase) + 0.22 * Math.sin(phase * 2) + 0.08 * Math.sin(phase * 3)
    const attack = 1 - Math.exp(-time / 0.018)
    const release = Math.min(1, (duration - time) / 0.15)
    return tone * attack * Math.exp(-time / 1.25) * release * volume
  })
}

function kick(start) {
  mix(start, 0.3, (time) => {
    const phase = 2 * Math.PI * (48 * time + 82 * 0.035 * (1 - Math.exp(-time / 0.035)))
    return Math.sin(phase) * Math.min(1, time / 0.004) * Math.exp(-time / 0.055) * 0.12
  })
}

function percussion(start, volume, decay, highPass) {
  let low = 0
  mix(start, 0.22, (time) => {
    const noise = randomNoise()
    low = low * 0.65 + noise * 0.35
    return (highPass ? noise - low : low) * Math.exp(-time / decay) * volume
  })
}

const chords = [
  [174.61, 220, 261.63, 329.63], // Fa majeur 7
  [130.81, 164.81, 196, 246.94], // Do majeur 7
  [110, 164.81, 196, 261.63], // La mineur 7
  [98, 146.83, 196, 246.94], // Sol majeur
]

for (let measure = 0; measure < 8; measure++) {
  const start = measure * bar
  const chord = chords[measure % chords.length]
  chord.forEach((frequency, index) => note(start + index * 0.025, frequency, bar * 0.95, 0.025))
  note(start, chord[0] / 2, beat * 0.9, 0.07)
  note(start + beat * 2.5, chord[0] / 2, beat * 0.6, 0.055)
  note(start + beat * 1.5, chord[2] * 2, beat * 0.65, 0.016)
  note(start + beat * 3.25, chord[1] * 2, beat * 0.55, 0.012)
  kick(start)
  kick(start + beat * 2.5)
  percussion(start + beat, 0.04, 0.045, false)
  percussion(start + beat * 3, 0.035, 0.045, false)
  for (let hit = 0; hit < 8; hit++) {
    const swing = hit % 2 === 1 ? beat * 0.06 : 0
    percussion(start + hit * beat / 2 + swing, hit % 2 === 0 ? 0.009 : 0.006, 0.018, true)
  }
}

const dry = samples.slice()
const delay = Math.round(beat * 0.75 * sampleRate)
let peak = 0
for (let index = 0; index < samples.length; index++) {
  samples[index] += dry[(index - delay + samples.length) % samples.length] * 0.12
  peak = Math.max(peak, Math.abs(samples[index]))
}
assert(Number.isFinite(peak) && peak > 0, 'La boucle doit contenir un signal audio valide.')

const wav = Buffer.alloc(44 + samples.length * 2)
wav.write('RIFF', 0)
wav.writeUInt32LE(wav.length - 8, 4)
wav.write('WAVE', 8)
wav.write('fmt ', 12)
wav.writeUInt32LE(16, 16)
wav.writeUInt16LE(1, 20)
wav.writeUInt16LE(1, 22)
wav.writeUInt32LE(sampleRate, 24)
wav.writeUInt32LE(sampleRate * 2, 28)
wav.writeUInt16LE(2, 32)
wav.writeUInt16LE(16, 34)
wav.write('data', 36)
wav.writeUInt32LE(samples.length * 2, 40)
for (let index = 0; index < samples.length; index++) {
  const value = Math.tanh(samples[index] * 0.65 / peak)
  wav.writeInt16LE(Math.round(value * 32767), 44 + index * 2)
}

const directory = new URL('../public/audio/', import.meta.url)
mkdirSync(directory, { recursive: true })
writeFileSync(new URL('island-lofi.wav', directory), wav)
console.log(`Boucle originale : ${(samples.length / sampleRate).toFixed(1)} s, ${Math.round(wav.length / 1024)} Ko.`)
