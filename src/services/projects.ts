import 'server-only'
import { z } from 'zod'
import { readSupabase, type SupabaseError } from './supabase'

// Ce schéma décrit les champs que la page utilise réellement.
const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  skills: z.array(z.object({ name: z.string().trim().min(1) })),
})

const projectsSchema = z.array(projectSchema)

type Project = z.infer<typeof projectSchema>

type ProjectsResult =
  | { ok: true; projects: Project[] }
  | SupabaseError

export async function getProjects(): Promise<ProjectsResult> {
  // Supabase retrouve la relation via la clé composée de project_skills.
  const response = await readSupabase('projects', {
    select: 'slug,title,summary,skills(name)',
    published_at: 'not.is.null',
    order: 'published_at.desc,slug.asc',
  })
  if (!response.ok) return response

  const result = projectsSchema.safeParse(response.data)
  if (!result.success) return { ok: false, reason: 'validation' }

  return { ok: true, projects: result.data }
}
