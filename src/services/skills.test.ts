import { afterEach, expect, test, vi } from 'vitest'
import { getSkills } from './skills'

vi.mock('server-only', () => ({}))

function mockFetch(response: Response) {
  vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('SUPABASE_PUBLISHABLE_KEY', 'test-public-key')
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

test('lit les noms et catégories depuis skills, sans demander de niveau', async () => {
  const skills = [
    { name: 'React', category: 'Interfaces' },
    { name: 'Zod', category: 'Données' },
  ]
  const fetchMock = mockFetch(Response.json(skills))
  expect(await getSkills()).toEqual({ ok: true, skills })

  const [input, options] = fetchMock.mock.calls[0]
  const url = new URL(String(input))
  expect(url.pathname).toBe('/rest/v1/skills')
  expect(url.searchParams.get('select')).toBe('name,category')
  expect(url.searchParams.get('order')).toBe('category.asc,name.asc')
  expect(options?.headers).toEqual({ apikey: 'test-public-key' })
  expect(options?.cache).toBe('no-store')
})

test('une table vide reste un succès, sans badges inventés', async () => {
  mockFetch(Response.json([]))
  expect(await getSkills()).toEqual({ ok: true, skills: [] })
})

test.each([
  { name: '', category: 'Interfaces' },
  { name: 'React', category: null },
  { name: 'React', category: '   ' },
  { name: 42, category: 'Interfaces' },
])('rejette une compétence invalide : %j', async (skill) => {
  mockFetch(Response.json([skill]))
  expect(await getSkills()).toEqual({ ok: false, reason: 'validation' })
})

test('une erreur de lecture reste distincte d’une erreur de validation', async () => {
  mockFetch(new Response('Unavailable', { status: 503 }))
  expect(await getSkills()).toEqual({ ok: false, reason: 'request' })
})

test('une configuration manquante évite toute requête', async () => {
  const fetchMock = mockFetch(Response.json([]))
  vi.stubEnv('SUPABASE_URL', '')
  expect(await getSkills()).toEqual({ ok: false, reason: 'configuration' })
  expect(fetchMock).not.toHaveBeenCalled()
})
