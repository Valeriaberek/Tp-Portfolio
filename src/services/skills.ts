import 'server-only'
import { z } from 'zod'
import { readSupabase, type SupabaseError } from './supabase'

const skillSchema = z.object({
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
})

const skillsSchema = z.array(skillSchema)

type Skill = z.infer<typeof skillSchema>
type SkillsResult = { ok: true; skills: Skill[] } | SupabaseError

export async function getSkills(): Promise<SkillsResult> {
  // Le niveau n’est pas demandé : la page affiche uniquement des badges.
  const response = await readSupabase('skills', {
    select: 'name,category',
    order: 'category.asc,name.asc',
  })
  if (!response.ok) return response

  const result = skillsSchema.safeParse(response.data)
  if (!result.success) return { ok: false, reason: 'validation' }

  return { ok: true, skills: result.data }
}
