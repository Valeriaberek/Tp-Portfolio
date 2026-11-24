'use client'

import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { contactSchema } from './contactSchema'
import styles from './ContactForm.module.css'

type ContactErrors = {
  name?: string
  email?: string
  message?: string
}

export default function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({})
  const [isValid, setIsValid] = useState(false)

  function validateMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    // La validation reste locale : aucun message n’est envoyé pour le moment.
    const result = contactSchema.safeParse({
      name: data.get('name'),
      email: data.get('email'),
      message: data.get('message'),
    })

    setIsValid(result.success)
    if (result.success) {
      setErrors({})
      return
    }

    const fieldErrors = z.flattenError(result.error).fieldErrors
    setErrors({ name: fieldErrors.name?.[0], email: fieldErrors.email?.[0], message: fieldErrors.message?.[0] })
    const firstField = result.error.issues[0]?.path[0]
    if (typeof firstField === 'string') {
      const input = form.elements.namedItem(firstField)
      if (input instanceof HTMLElement) input.focus()
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={validateMessage} onChange={() => setIsValid(false)}>
      <div className={styles.field}>
        <label htmlFor="contact-name">Ton nom</label>
        <input id="contact-name" name="name" autoComplete="name" required maxLength={80}
          aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <p id="name-error" className={styles.error} role="alert">{errors.name}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-email">Ton adresse e-mail</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254}
          aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <p id="email-error" className={styles.error} role="alert">{errors.email}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Ton petit mot</label>
        <textarea id="contact-message" name="message" rows={6} required minLength={10} maxLength={2000}
          aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-hint message-error' : 'message-hint'} />
        <p id="message-hint" className={styles.hint}>De 10 à 2000 caractères.</p>
        {errors.message && <p id="message-error" className={styles.error} role="alert">{errors.message}</p>}
      </div>
      <p className={styles.hint}>Ce formulaire ne transmet pas encore les messages.</p>
      <button type="submit" className={styles.button}>Vérifier mon message</button>
      <p role="status" className={styles.status}>
        {isValid ? 'Ton message est valide. Il reste ici, sans être envoyé.' : ''}
      </p>
    </form>
  )
}
