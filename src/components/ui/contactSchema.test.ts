import { expect, test } from 'vitest'
import { contactSchema } from './contactSchema'

const validMessage = {
  name: 'Léa',
  email: 'lea@example.com',
  message: 'Bonjour, je souhaite discuter de mon projet.',
}

test('un message valide conserve son contenu et retire les espaces autour des champs', () => {
  const result = contactSchema.parse({
    name: `  ${validMessage.name}  `,
    email: `  ${validMessage.email}  `,
    message: `  ${validMessage.message}  `,
  })
  expect(result).toEqual(validMessage)
})

test.each([
  ['name', '   '],
  ['email', 'adresse-invalide'],
  ['message', 'Court'],
  ['message', 'a'.repeat(2001)],
])('le champ %s invalide est signalé au bon endroit', (field, value) => {
  const result = contactSchema.safeParse({ ...validMessage, [field]: value })
  expect(result.success).toBe(false)
  if (!result.success) expect(result.error.issues[0]?.path).toEqual([field])
})
