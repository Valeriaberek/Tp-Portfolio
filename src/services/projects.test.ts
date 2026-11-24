import { afterEach, expect, test, vi } from 'vitest'
import { getProjects } from './projects'

vi.mock('server-only', () => ({}))

const validProject = {
  slug: 'portfolio',
  title: 'Portfolio 3D',
  summary: 'Une île pour découvrir mes projets.',
  skills: [{ name: 'TypeScript' }, { name: 'React' }],
}

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

test('lit les projets publiés et leurs compétences via la relation', async () => {
  const fetchMock = mockFetch(Response.json([validProject]))
  expect(await getProjects()).toEqual({ ok: true, projects: [validProject] })

  const [input, options] = fetchMock.mock.calls[0]
  const url = new URL(String(input))
  expect(url.pathname).toBe('/rest/v1/projects')
  expect(url.searchParams.get('select')).toBe('slug,title,summary,skills(name)')
  expect(url.searchParams.get('published_at')).toBe('not.is.null')
  expect(options?.headers).toEqual({ apikey: 'test-public-key' })
  expect(options?.cache).toBe('no-store')
})

test('une liste vide est un résultat valide', async () => {
  mockFetch(Response.json([]))
  expect(await getProjects()).toEqual({ ok: true, projects: [] })
})

test('une configuration manquante évite toute requête', async () => {
  const fetchMock = mockFetch(Response.json([]))
  vi.stubEnv('SUPABASE_PUBLISHABLE_KEY', '')
  expect(await getProjects()).toEqual({ ok: false, reason: 'configuration' })
  expect(fetchMock).not.toHaveBeenCalled()
})

test('une erreur HTTP est une erreur de requête', async () => {
  mockFetch(new Response('Unavailable', { status: 503 }))
  expect(await getProjects()).toEqual({ ok: false, reason: 'request' })
})

test('une panne réseau est une erreur de requête', async () => {
  mockFetch(Response.json([])).mockRejectedValue(new TypeError('Network error'))
  expect(await getProjects()).toEqual({ ok: false, reason: 'request' })
})

test('un JSON illisible est une erreur de validation', async () => {
  mockFetch(new Response('invalid-json'))
  expect(await getProjects()).toEqual({ ok: false, reason: 'validation' })
})

test.each([
  [{ ...validProject, title: null }],
  [{ ...validProject, skills: [{ name: 42 }] }],
  [{ ...validProject, slug: '../autre-page' }],
])('rejette des champs ou des compétences invalides : %j', async (data) => {
  mockFetch(Response.json([data]))
  expect(await getProjects()).toEqual({ ok: false, reason: 'validation' })
})
