# Trace d’usage de l’IA

Ce document résume le travail réalisé avec l’assistant. Il sert de support à
reformuler avec mes mots ; il ne prouve pas à lui seul que je maîtrise le code.

## Cadre demandé par l’étudiante

- Travailler localement sur le projet existant, sans déploiement.
- Avancer par étapes avec un code simple, typé et explicable en soutenance.
- Utiliser Next.js, TypeScript strict, Zod, Zustand et Supabase.
- Garder l’accès au clavier et respecter la réduction des animations.
- Ne pas inventer de projets, de parcours ou de niveaux de compétences.

## Choix réalisés ensemble

| Étape | Contribution de l’IA | Décision de l’étudiante |
| --- | --- | --- |
| Application | Passage à Next.js App Router, pages et CSS Modules | Conserver une organisation simple et travailler en local |
| Univers visuel | Île et objets construits avec des formes React Three Fiber | Palette pastel, une maison, des arbres et un personnage de poche |
| Navigation | Liens communs aux objets 3D et au menu HTML | Maison → Compétences, figurine → À propos, panneau → Projets, boîte → Contact |
| Jour/nuit | Store Zustand, persistance limitée au mode, fenêtres lumineuses | Afficher simplement « Jour » et « Nuit » |
| Contact | Formulaire et validation Zod accessibles | Une page distincte avec le décor de l’accueil |
| Musique | Boucle instrumentale originale générée en local et lecteur HTML | Ambiance lo-fi, démarrage volontaire |
| Personnage | Même modèle réutilisé sur l’île et dans le petit portrait | Conserver la figurine animée et retirer l’oiseau perché |

## Supabase — 23 novembre 2026

L’étudiante a fourni les captures puis l’export JSON de sa base. L’assistant a
identifié la relation `projects` → `project_skills` → `skills` et les politiques
de lecture. La structure existante a été conservée.

La liste `/projets` lit les titres, résumés et compétences depuis un service
`server-only`. Zod valide la configuration et la réponse ; la page distingue
une liste vide des erreurs de lecture ou de validation. Les tests simulent les
réponses de Supabase. Aucune table ni ligne distante n’a été créée par l’assistant.

## Nettoyage — 23 novembre 2026

À la demande de l’étudiante, l’assistant a supprimé les essais Vite inutilisés,
les anciennes icônes, l’ancien tableau de projets et les modèles SQL incompatibles
avec la base existante. Les destinations du menu et des objets 3D sont regroupées.
La visibilité et le mouvement réduit des deux scènes partagent un seul hook.

Les commentaires expliquent les points utiles pour l’oral : validation des données
externes, persistance du thème, chargement à l’apparition et animation avec des refs.
Le README décrit l’état actuel ; les étapes abandonnées n’y figurent plus comme
des instructions à appliquer.

Fichiers principaux de ce nettoyage :

- `src/data/navigation.ts` : remplace les quatre fichiers de destinations.
- `src/hooks/useSceneVisibility.ts` : remplace le code répété dans `IslandPreview`
  et `AboutPortrait`.
- `Navbar`, `House`, `Mailbox`, `ProjectsBoard` et `PocketCharacter` : imports
  des destinations mis à jour ; commentaires sur le toit et l’animation du bras.
- `IslandScene`, `Smoke`, `ContactForm`, `projects.ts` et `themeStore.ts` :
  commentaires courts sur le cadrage, l’animation et les validations.
- `src/app/projets/page.tsx` : commentaire expliquant le rendu dynamique.
- `SkillsInventory.tsx` : texte de la prochaine étape corrigé.
- `PortfolioTheme.module.css` : regroupement des deux blocs `.theme`.
- `.oxlintrc.json` : interdiction de `any` et reconnaissance des exports Next.js.
- `README.md`, `supabase/README.md` et ce document : documentation actualisée.

Vérifications après nettoyage : 21 tests réussis, TypeScript et build réussis,
lint sans erreur ni avertissement. La recherche des imports locaux et des classes
CSS référencées ne détecte pas de référence cassée ni de fichier source isolé.
L’ancien dossier `dist` de Vite a également été supprimé.

## Compétences depuis Supabase — 24 novembre 2026

L’étudiante a demandé de remplacer les badges locaux par le contenu de sa table
`skills`. L’assistant a ajouté un service serveur qui lit `name` et `category`,
valide la liste avec Zod et distingue une liste vide des erreurs. La page regroupe
les badges selon les catégories reçues, sans lire le champ `level`.

La lecture HTTP et la validation de configuration sont communes aux services
Projets et Compétences. Les schémas Zod restent dans leurs services respectifs.
Le fichier local `src/data/skills.ts` a été retiré. Les couleurs et symboles restent
définis par la présentation, sans imposer de catégories prédéfinies à la base.
Le bloc « Prochaine quête » reste supprimé, à la demande de l’étudiante.

Les tests de cette étape utilisent des réponses simulées. Aucune table ni ligne
distante n’a été ajoutée ou modifiée. Il reste à vérifier la page avec le contenu
réel de `skills` et à reformuler le parcours : requête, validation, regroupement,
affichage.

## À vérifier et à reformuler par l’étudiante

Les commandes de vérification et les parcours manuels sont dans le README.
Les tests automatisés ne remplacent pas le rendu dans le navigateur, la manipulation
sur téléphone, l’écoute de la musique ni la lecture réelle de Supabase.
Les images Storage, les fiches, la recherche, la pagination et Lighthouse restent
à réaliser. Le formulaire n’envoie pas encore de message.

Questions pour préparer l’oral :

- Pourquoi Zod est-il nécessaire alors que TypeScript est strict ?
- Pourquoi les appels Supabase restent-ils côté serveur ?
- Pourquoi persister uniquement le mode jour/nuit ?
- À quoi servent les refs dans l’animation du bras ?
- Pourquoi garder des liens HTML en plus des objets cliquables ?
- Pourquoi l’accueil est-il statique et la liste des projets dynamique ?

À compléter personnellement : les essais réellement effectués, les difficultés
rencontrées et les choix que je suis capable d’expliquer sans l’assistant.
