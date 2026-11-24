import { afterAll, beforeEach, expect, test, vi } from 'vitest'

// Les tests tournent sans navigateur : cette Map simule son stockage local.
const storage = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
})
vi.stubGlobal('window', { localStorage: globalThis.localStorage })

// On importe le store après avoir préparé le faux environnement navigateur.
const { useThemeStore } = await import('./themeStore')

beforeEach(() => {
  // Chaque test démarre avec le même état, sans préférence laissée par le précédent.
  useThemeStore.setState({ mode: 'day' })
  storage.clear()
})

afterAll(() => vi.unstubAllGlobals())

test('le bouton bascule le mode et seule la préférence est sauvegardée', () => {
  // Hors d’un composant, getState() lit le store sans abonnement React.
  useThemeStore.getState().toggleMode()
  expect(useThemeStore.getState().mode).toBe('night')
  expect(JSON.parse(storage.get('portfolio-theme') ?? 'null')).toEqual({
    state: { mode: 'night' },
    version: 0,
  })
  useThemeStore.getState().toggleMode()
  expect(useThemeStore.getState().mode).toBe('day')
})

test('la préférence nuit est restaurée après réhydratation', async () => {
  storage.set('portfolio-theme', JSON.stringify({ state: { mode: 'night' }, version: 0 }))
  expect(useThemeStore.getState().mode).toBe('day')
  await useThemeStore.persist.rehydrate()
  expect(useThemeStore.getState().mode).toBe('night')
  useThemeStore.getState().toggleMode()
  expect(useThemeStore.getState().mode).toBe('day')
})

test('une préférence invalide est ignorée', async () => {
  storage.set('portfolio-theme', JSON.stringify({ state: { mode: 'invalide' }, version: 0 }))
  await useThemeStore.persist.rehydrate()
  expect(useThemeStore.getState().mode).toBe('day')
})

test('un stockage JSON corrompu ne bloque pas le mode par défaut', async () => {
  storage.set('portfolio-theme', '{')
  await useThemeStore.persist.rehydrate()
  expect(useThemeStore.getState().mode).toBe('day')
})
