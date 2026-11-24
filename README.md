# Portfolio 3D

Portfolio de Master en Next.js App Router et TypeScript strict. L’accueil présente
une île low-poly ; ses objets et le menu HTML ouvrent les mêmes rubriques.

## Démarrer en local

```sh
npm install
```

Si `.env.local` n’existe pas, copier `.env.example` vers `.env.local`, puis renseigner
`SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` avec les valeurs du projet Supabase.
Ne jamais publier `.env.local` ni utiliser de clé secrète ou `service_role`.

```sh
npm run dev
```

Ouvrir http://localhost:3000, ou le port indiqué dans le terminal. Redémarrer le
serveur après une modification des variables d’environnement.
L’accueil, À propos et Contact restent consultables sans Supabase ; les pages
Projets et Compétences affichent alors un message de configuration manquante.

## Organisation

- `src/app/` : pages `/`, `/a-propos`, `/competences`, `/projets` et `/contact`.
- `src/components/three/` : île, objets 3D, personnage et contrôles de caméra.
- `src/components/ui/` : décor commun, formulaires et lecteur musical.
- `src/components/Navbar/` : menu HTML et lien pour aller au contenu.
- `src/data/` : destinations partagées entre le menu et les objets 3D.
- `src/hooks/useSceneVisibility.ts` : visibilité des scènes et mouvement réduit.
- `src/services/` : lecture Supabase commune et validation Zod des projets et compétences.
- `src/store/themeStore.ts` : préférence jour/nuit avec Zustand.
- `public/` : icône, illustration et boucle musicale originales.
- `supabase/` : documentation de la base existante et inspection en lecture seule.

## Les choix à expliquer

TypeScript vérifie le code avant l’exécution. Zod vérifie les données reçues à
l’exécution : réponse Supabase, formulaire et préférence sauvegardée.
Les types des données validées sont déduits des schémas avec `z.infer`.

La lecture Supabase est protégée par `server-only`. Une erreur de requête et une
erreur de validation donnent des résultats distincts ; une liste vide est normale.
`/projets` et `/competences` sont dynamiques et sans cache. L’accueil est pré-rendu statiquement.
[La documentation de la base](supabase/README.md) décrit les tables et les permissions.

Seul le mode jour/nuit est persisté avec `partialize`. La préférence est relue
après le montage pour garder le même HTML initial côté serveur et navigateur.

Les scènes sont chargées lorsqu’elles deviennent visibles. Les animations
s’arrêtent hors écran et respectent `prefers-reduced-motion`. Les liens du menu
permettent d’accéder aux rubriques au clavier, sans utiliser la 3D.
La musique démarre uniquement au clic et reste dans le layout pendant la navigation.

## Vérifications

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Après le build, `npm start` permet de tester le rendu de production localement.
Les tests couvrent la validation du formulaire, la persistance du thème, les
réponses Supabase simulées et l’intégrité du fichier musical.
Ils ne remplacent pas les essais visuels, l’écoute et la lecture réelle de la base.

À vérifier dans le navigateur :

1. Ouvrir chaque rubrique depuis l’île et depuis le menu, puis revenir à l’accueil.
2. Passer en nuit et recharger : le ciel, les fenêtres et le bouton restent cohérents.
3. Tester la rotation, le zoom et la figurine, puis activer la réduction des animations.
4. Avec Tab et Entrée, parcourir les liens ; vérifier le formulaire avec des champs vides.
5. Vérifier les pages et les boutons flottants sur un écran de téléphone.
6. Ouvrir `/projets` : données publiées ou message de liste vide, selon la base.
7. Ouvrir `/competences` : badges regroupés selon `skills.category`, ou inventaire vide.

## Ce qui reste à réaliser pour le devoir

- Les fiches `/projets/[slug]`, avec un état de projet introuvable.
- La recherche et la pagination dans l’URL.
- Les images des projets dans Supabase Storage, affichées avec `next/image`.
- Une mesure Lighthouse avant/après une optimisation, en conservant les rapports.

Le formulaire Contact valide les champs localement ; aucun message n’est envoyé.
La page Compétences lit `skills.name` et `skills.category` dans Supabase, sans jauges
ni notes. Si la table est vide, aucun badge local n’est ajouté en remplacement.
L’illustration de la liste Projets est un visuel d’attente, pas une capture de chaque projet.

## Usage de l’IA

[La trace de collaboration](docs/usage-ia.md) résume les décisions et ce que
l’étudiante doit encore tester et reformuler pour sa soutenance.
