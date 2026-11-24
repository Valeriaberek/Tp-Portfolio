'use client'

import { useRef, useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import styles from './MusicPlayer.module.css'

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  // Le thème vient du store commun ; lecture, volume et erreurs restent locaux au lecteur.
  const mode = useThemeStore((state) => state.mode)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(20)
  const [error, setError] = useState('')

  async function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return
    setError('')
    if (!audio.paused) {
      audio.pause()
      return
    }

    setIsLoading(true)
    try {
      audio.volume = volume / 100
      await audio.play()
    } catch {
      setError('La musique ne peut pas démarrer. Réessaie avec le bouton lecture.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <aside className={styles.player} data-mode={mode} aria-label="Musique d’ambiance">
      <audio
        ref={audioRef}
        src="/audio/island-lofi.wav"
        loop
        preload="none"
        hidden
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false)
          setError('La musique est indisponible pour le moment.')
        }}
      />
      <button
        type="button"
        className={styles.playButton}
        aria-label={isLoading ? 'Chargement de la musique' : isPlaying ? 'Mettre la musique lo-fi en pause' : 'Écouter la musique lo-fi'}
        aria-pressed={isPlaying}
        disabled={isLoading}
        onClick={toggleMusic}
      >
        <span aria-hidden="true">{isLoading ? '…' : isPlaying ? 'Ⅱ' : '▶'}</span>
        <span>Lo-fi</span>
      </button>
      <label htmlFor="lofi-volume" className={styles.volumeLabel}>Volume</label>
      <input
        id="lofi-volume"
        type="range"
        min={0}
        max={100}
        step={1}
        value={volume}
        className={styles.volume}
        onChange={(event) => {
          const nextVolume = event.currentTarget.valueAsNumber
          setVolume(nextVolume)
          if (audioRef.current) audioRef.current.volume = nextVolume / 100
        }}
      />
      {error && <p role="alert" className={styles.error}>{error}</p>}
    </aside>
  )
}
