# Base Supabase du portfolio

Le portfolio réutilise une base existante. Sa structure et ses règles d’accès ont
été vérifiées à partir de l’export JSON fourni le 23 novembre 2026.
Aucune migration ni donnée n’a été appliquée à distance par l’assistant.

## Tables existantes

| Table | Rôle | Colonnes principales |
| --- | --- | --- |
| `projects` | Réalisations | `id`, `created_at`, `title`, `slug`, `summary`, `description`, `cover_url`, `cover_alt`, `demo_url`, `repo_url`, `published_at` |
| `skills` | Compétences | `id`, `created_at`, `name`, `category`, `level` |
| `project_skills` | Association entre projets et compétences | `project_id`, `skill_id` |
| `pages` | Pages éditoriales, non utilisées par le site actuellement | `id`, `created_at`, `title`, `slug`, `content`, `published_at` |
| `articles` | Articles, non utilisés par le site actuellement | `id`, `created_at`, `title`, `slug`, `excerpt`, `content`, `cover_url`, `cover_alt`, `published_at` |

`projects.slug` et `skills.name` sont uniques. La clé primaire de `project_skills`
est la paire `(project_id, skill_id)` : une association ne peut pas être dupliquée.
Ses deux clés étrangères référencent `projects.id` et `skills.id`.
La relation est plusieurs-à-plusieurs : un projet peut avoir plusieurs compétences,
et une compétence peut être associée à plusieurs projets.

## Permissions confirmées par l’export

RLS, la protection des lignes de PostgreSQL, est active sur les cinq tables.
Les rôles `anon` et `authenticated` disposent uniquement du droit `SELECT` :

- `projects`, `pages` et `articles` : lecture si `published_at IS NOT NULL`.
- `project_skills` : lecture des associations vers un projet publié.
- `skills` : lecture de toutes les compétences.

Une date future renseignée est donc déjà considérée comme publiée par ces règles.
Laisser `published_at` vide conserve un projet en brouillon.
Les visiteurs ne peuvent pas ajouter, modifier ou supprimer des lignes avec ces droits.
L’export de structure ne permet pas de connaître les tables remplies.

## Lecture côté serveur

Configurer `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env.local`.
La fonction commune `src/services/supabase.ts`, protégée par `server-only`, appelle
l’API REST avec la clé publique dans l’en-tête `apikey`. Aucune clé secrète n’est nécessaire.

`projects.ts` sélectionne `slug,title,summary,skills(name)` via `project_skills`.
`skills.ts` sélectionne `name,category` directement dans `skills` et trie les lignes
par catégorie puis par nom. Le champ `level` n’est pas lu.
Zod vérifie la configuration commune, puis chaque service valide ses données.
Les services distinguent les erreurs de configuration, de requête et de validation.
Les requêtes n’écrivent rien dans la base.

Ouvrir `/projets` pour vérifier la connexion réelle. Une liste vide est attendue
si aucun projet n’est publié. Les tests automatisés utilisent des réponses simulées.

Ouvrir `/competences` pour vérifier les badges. Les noms et catégories viennent
entièrement de la base ; les couleurs et symboles restent des éléments de présentation.
Une catégorie nouvelle est affichée automatiquement. La page est dynamique et ne
met pas la requête en cache. Si `skills` est vide, un message le signale.

## Inspecter la base sans captures

Copier `inspect_schema.sql` dans une nouvelle requête du SQL Editor, puis cliquer
sur Run. La cellule `schema_portfolio` contient les colonnes, contraintes, clés
étrangères, politiques RLS et droits publics. Le script est en lecture seule et
ne récupère pas le contenu des lignes.

Les anciens modèles de création pour une base vide ont été retirés : ils ne
correspondaient pas à ce schéma. Ne pas recréer ni supprimer les tables existantes.

## Ajouter les premiers contenus

`seed_portfolio.sql` est adapté aux tables existantes. Il prépare :

- 12 compétences dans les quatre catégories du portfolio, dont Supabase ;
- le seul projet réel décrit ici : « Portfolio 3D kawaii », slug `portfolio` ;
- les associations entre ce projet et les 12 compétences.

Le script est préparé localement : il n’a pas encore été exécuté sur ta base.
Les identifiants sont générés par la base, comme dans le schéma SQL du cours.
Les champs `level`, les images et les liens externes ne sont pas renseignés.

1. Ouvrir `seed_portfolio.sql` et relire les noms, catégories et textes.
2. Dans le bon projet Supabase, ouvrir **SQL Editor > New query**.
3. Copier tout le script, puis cliquer sur **Run** avec le rôle administrateur
   habituel du SQL Editor (`postgres`), pas avec la clé publique du site.
4. Le résultat doit afficher le projet `portfolio`, une date `published_at` et
   `nombre_de_competences` égal à 12 sur une base initialement vide.
5. Recharger `/competences` et `/projets` dans le navigateur.

`BEGIN` et `COMMIT` regroupent les insertions dans une transaction. Une erreur
empêche leur validation. `ON CONFLICT ... DO NOTHING` évite les doublons si le
script est relancé et préserve le contenu des lignes existantes.

Si un projet de slug `portfolio` existe déjà en brouillon, le script ne le publie
pas à ta place : relire son contenu dans le Table Editor, puis renseigner
`published_at` pour le rendre visible. Des associations déjà présentes sont
conservées ; le compteur peut donc dépasser 12 sur une base déjà remplie.
Si le SQL Editor affiche une erreur, copier son message avant de modifier le script.

## Images Storage : prochaine étape

Les images des projets ne sont pas encore connectées au site. Depuis le tableau
de bord Supabase, il faudra :

1. Créer un bucket `project-images` public en lecture.
2. Limiter les fichiers à 5 Mo et aux formats JPEG, PNG, WebP ou AVIF.
3. Téléverser une vraie capture et copier son URL publique.
4. Renseigner `projects.cover_url` et son texte alternatif `projects.cover_alt`.

Le code devra ensuite valider ces champs et autoriser le domaine Storage pour
`next/image`, avec des dimensions réservées. Aucun bucket ni fichier distant n’a
été créé pendant le nettoyage. Un bucket public ne donne pas automatiquement le
droit de téléverser ou de supprimer ses fichiers.
