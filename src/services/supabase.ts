import 'server-only'
import { z } from 'zod'

const configurationSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
  key: z.string().trim().min(1),
})

export type SupabaseError = {
  ok: false
  reason: 'configuration' | 'request' | 'validation'
}

type SupabaseResult = { ok: true; data: unknown } | SupabaseError

// La requête est commune ; chaque service valide ensuite les champs de sa table.
export async function readSupabase(
  table: 'projects' | 'skills',
  parameters: Record<string, string>,
): Promise<SupabaseResult> {
  const configuration = configurationSchema.safeParse({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_PUBLISHABLE_KEY,
  })

  if (!configuration.success) return { ok: false, reason: 'configuration' }

  const url = new URL(`/rest/v1/${table}`, configuration.data.url)
  url.search = new URLSearchParams(parameters).toString()

  let response: Response
  try {
    response = await fetch(url, {
      headers: { apikey: configuration.data.key },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return { ok: false, reason: 'request' }
  }

  if (!response.ok) return { ok: false, reason: 'request' }

  // La réponse externe reste inconnue tant que son service ne l’a pas validée.
  try {
    const data: unknown = await response.json()
    return { ok: true, data }
  } catch {
    return { ok: false, reason: 'validation' }
  }
}
