import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Indique ton nom.').max(80, 'Ton nom doit contenir au maximum 80 caractères.'),
  email: z.string().trim().max(254, 'Cette adresse e-mail est trop longue.').pipe(z.email('Indique une adresse e-mail valide.')),
  message: z.string().trim().min(10, 'Écris au moins 10 caractères.').max(2000, 'Ton message doit contenir au maximum 2000 caractères.'),
})
