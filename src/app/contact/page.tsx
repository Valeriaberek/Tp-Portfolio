import type { Metadata } from 'next'
import Link from 'next/link'
import PortfolioTheme from '@/components/ui/PortfolioTheme'
import ContactForm from '@/components/ui/ContactForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Contact | Mon portfolio',
  description: 'Un petit mot, une question ou une idée de projet à partager.',
}

export default function ContactPage() {
  return (
    <PortfolioTheme>
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <Link href="/" className={styles.backLink}>← Retour à l’île</Link>
        <section className={styles.card} aria-labelledby="contact-title">
          <span className={styles.envelope} aria-hidden="true">✉</span>
          <h1 id="contact-title">Laisse-moi un petit mot</h1>
          <p>Une question, une idée ou simplement envie d’échanger ?</p>
          <ContactForm />
        </section>
      </main>
    </PortfolioTheme>
  )
}
