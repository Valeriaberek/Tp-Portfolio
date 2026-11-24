'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'

// Zod vérifie la préférence relue : seules les valeurs "day" et "night" sont acceptées.
const themePreferenceSchema = z.object({ mode: z.enum(['day', 'night']) })

// Le type du store réunit la donnée "mode" et l’action "toggleMode".
// z.infer déduit le type de la donnée à partir du schéma Zod.
type ThemeState = z.infer<typeof themePreferenceSchema> & {
  toggleMode: () => void
}

// create vient de Zustand : il crée le store partagé et retourne un hook React.
// useThemeStore est le nom que nous donnons à ce hook, utilisé dans les composants.
export const useThemeStore = create<ThemeState>()(
  // persist ajoute la sauvegarde et la restauration dans localStorage.
  persist(
    (set) => ({
      // Valeur de départ, avant de relire une éventuelle préférence sauvegardée.
      mode: 'day',
      // set reçoit l’état précédent et fusionne la modification avec le reste du store.
      // L’action passe du jour à la nuit, ou de la nuit au jour.
      toggleMode: () => set((state) => ({ mode: state.mode === 'day' ? 'night' : 'day' })),
    }),
    {
      // Nom de l’entrée visible dans le localStorage du navigateur.
      name: 'portfolio-theme',
      // On enregistre uniquement la préférence, jamais les fonctions du store.
      partialize: (state) => ({ mode: state.mode }),
      // Le serveur ne connaît pas localStorage : on reporte la restauration.
      // PortfolioTheme appelle rehydrate() après montage pour garder le même HTML initial.
      skipHydration: true,
      merge: (savedPreference, currentState) => {
        const result = themePreferenceSchema.safeParse(savedPreference)
        // Une préférence valide remplace le mode ; les actions du store sont conservées.
        // Si elle est invalide, on garde l’état courant.
        return result.success ? { ...currentState, ...result.data } : currentState
      },
    },
  ),
)
