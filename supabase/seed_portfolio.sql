-- À relire, puis à exécuter dans le SQL Editor de TON projet Supabase.
-- Ce fichier remplit les tables existantes : il ne crée ni ne supprime de table.
-- Les id et created_at sont générés automatiquement, comme dans le schéma du cours.

-- Toutes les insertions réussissent ensemble ; une erreur empêche leur validation.
begin;

-- Ces badges décrivent les outils utilisés dans ce portfolio, sans niveau de maîtrise.
insert into public.skills (name, category)
values
  ('React', 'Création d’interfaces'),
  ('Next.js', 'Création d’interfaces'),
  ('CSS Modules', 'Création d’interfaces'),
  ('TypeScript', 'Logique & données'),
  ('Zod', 'Logique & données'),
  ('Zustand', 'Logique & données'),
  ('Supabase', 'Logique & données'),
  ('Three.js', 'Univers interactifs'),
  ('React Three Fiber', 'Univers interactifs'),
  ('Drei', 'Univers interactifs'),
  ('VS Code', 'Atelier de développement'),
  ('Vitest', 'Atelier de développement')
-- Si une compétence existe déjà, son contenu reste inchangé.
on conflict (name) do nothing;

-- published_at rend ce nouveau projet visible avec les politiques RLS existantes.
-- Les images et les liens externes restent vides jusqu’à l’ajout des vraies valeurs.
insert into public.projects (title, slug, summary, description, published_at)
values (
  'Portfolio 3D kawaii',
  'portfolio',
  'Un portfolio interactif construit autour d’une île flottante low-poly.',
  'Projet réalisé dans le cadre de mon Master Développement Web. Une île flottante permet de découvrir les rubriques du portfolio. Le mode jour/nuit est partagé avec Zustand, la scène peut être tournée et zoomée, et une petite figurine anime la présentation. Les projets et les compétences sont lus depuis Supabase et validés avec Zod. Le formulaire Contact est validé localement ; son envoi et les images Storage restent à réaliser.',
  now()
)
-- Un projet déjà présent n’est ni remplacé ni publié automatiquement.
on conflict (slug) do nothing;

-- On retrouve les vrais identifiants au lieu de supposer qu’ils commencent à 1.
insert into public.project_skills (project_id, skill_id)
select projects.id, skills.id
from public.projects
cross join public.skills
where projects.slug = 'portfolio'
  and skills.name in (
    'React', 'Next.js', 'CSS Modules', 'TypeScript', 'Zod', 'Zustand',
    'Supabase', 'Three.js', 'React Three Fiber', 'Drei', 'VS Code', 'Vitest'
  )
on conflict (project_id, skill_id) do nothing;

commit;

-- Ce résultat permet de vérifier le projet et ses associations après l’insertion.
select projects.title, projects.slug, projects.published_at,
  count(project_skills.skill_id) as nombre_de_competences
from public.projects
left join public.project_skills on project_skills.project_id = projects.id
where projects.slug = 'portfolio'
group by projects.id, projects.title, projects.slug, projects.published_at;
