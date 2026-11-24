'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BackToIsland.module.css'

export default function BackToIsland() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <div className={styles.space}>
      <Link href="/" className={styles.link}>
        <svg className={styles.bird} viewBox="0 0 48 40" width="44" height="38" aria-hidden="true" focusable="false">
          <path d="M14 24L3 17L7 29L18 30Z" fill="#919cc5" />
          <ellipse cx="23" cy="25" rx="13" ry="10" fill="#a9b7db" />
          <ellipse cx="27" cy="28" rx="7" ry="5" fill="#fff0d9" />
          <circle cx="32" cy="15" r="9" fill="#bac3e5" />
          <path d="M40 13L47 17L40 20Z" fill="#efc88f" />
          <circle cx="35" cy="13" r="1.5" fill="#393449" />
          <ellipse className={styles.wing} cx="19" cy="24" rx="8" ry="5" fill="#919cc5" transform="rotate(-25 19 24)" />
        </svg>
        <span>Retour à l’île</span>
      </Link>
    </div>
  )
}
