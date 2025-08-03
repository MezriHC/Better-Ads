# Architecture & Règles de Projet

Ce document est le guide de référence unique pour la structure du projet. Son respect est impératif pour garantir la cohérence et la maintenabilité.

## 1. Arborescence Complète du Projet

L'architecture est modulaire. Elle est composée de **Fonctionnalités** autonomes (ex: `dashboard`) et d'un répertoire **Partagé** (`_shared`).

```
├─ prisma/                      # DATABASE - Configuration Prisma (OBLIGATOIRE à la racine)
│  └─ schema.prisma             # DATABASE - Schéma de base de données avec modèles
├─ src/app/                     # APPLICATION - Code source principal
│  ├─ _shared/                  # CODE PARTAGÉ À TOUTE L'APPLICATION
│  │  ├─ components/            # Composants UI génériques réutilisables
│  │  │  ├─ SessionProvider.tsx # AUTH - Provider NextAuth pour client
│  │  │  ├─ ThemeProvider.tsx   # THEME - Provider pour le thème
│  │  │  ├─ ThemeToggle.tsx     # THEME - Bouton pour changer de thème
│  │  │  ├─ button.tsx          # UI - Composant bouton de base
│  │  │  ├─ ExempleComposant1.tsx # EXEMPLE - Composant réutilisable 1
│  │  │  └─ ExempleComposant2.tsx # EXEMPLE - Composant réutilisable 2
│  │  ├─ database/              # DATABASE - Gestion base de données avec Prisma
│  │  │  ├─ client.ts           # DATABASE - Client Prisma principal (singleton)
│  │  │  ├─ types.ts            # DATABASE - Types de base de données et utilitaires
│  │  │  └─ queries/            # DATABASE - Requêtes organisées par modèle
│  │  │     ├─ user.ts          # DATABASE - Requêtes CRUD pour les utilisateurs
│  │  │     └─ [model].ts       # DATABASE - Exemple - Requêtes pour autres modèles
│  │  ├─ hooks/                 # Hooks React globaux
│  │  │  ├─ useAuth.ts          # AUTH - Hook principal d'authentification
│  │  │  ├─ useDatabase.ts      # DATABASE - Hook pour opérations base de données
│  │  │  ├─ ExempleHook1.ts     # EXEMPLE - Hook global 1
│  │  │  └─ ExempleHook2.ts     # EXEMPLE - Hook global 2
│  │  ├─ lib/                   # Fonctions utilitaires partagées
│  │  │  ├─ auth.ts             # AUTH - Configuration NextAuth avec adapter Prisma
│  │  │  ├─ utils.ts            # UI - Fonctions utilitaires (ex: cn pour classnames)
│  │  │  ├─ ExempleLib1.ts      # EXEMPLE - Utilitaire partagé 1
│  │  │  └─ ExempleLib2.ts      # EXEMPLE - Utilitaire partagé 2
│  │  └─ types/                 # Types TypeScript partagés
│  │     ├─ auth.ts             # AUTH - Types d'authentification étendus
│  │     ├─ common.ts           # EXEMPLE - Types communs
│  │     └─ api.ts              # EXEMPLE - Types d'API partagés
│  │
│  ├─ api/                      # TOUTES LES APIs DE L'APPLICATION (Next.js App Router)
│  │  ├─ auth/                  # AUTH - APIs NextAuth (OBLIGATOIRE)
│  │  │  └─ [...nextauth]/      # AUTH - Route NextAuth dynamique
│  │  │     └─ route.ts         # AUTH - Handler NextAuth avec Google Provider
│  │  ├─ users/                 # DATABASE - APIs pour gestion utilisateurs
│  │  │  └─ route.ts            # DATABASE - Endpoints CRUD utilisateurs avec auth
│  │  └─ dashboard/             # EXEMPLE - APIs pour la page principale
│  │     ├─ route.ts            # EXEMPLE - Endpoints page principale
│  │     ├─ services.ts         # EXEMPLE - Logique métier page principale
│  │     ├─ types.ts            # EXEMPLE - Types spécifiques page principale
│  │     └─ settings/           # EXEMPLE - APIs pour la sous-page
│  │        ├─ route.ts         # EXEMPLE - Endpoints sous-page
│  │        ├─ services.ts      # EXEMPLE - Logique métier sous-page
│  │        └─ types.ts         # EXEMPLE - Types spécifiques sous-page
│  │
│  ├─ login/                    # AUTH - PAGE DE CONNEXION (Route: /login)
│  │  ├─ components/            # Composants SPÉCIFIQUES à la page login
│  │  │  ├─ LoginButton.tsx     # AUTH - Bouton "Connexion avec Google"
│  │  │  ├─ ExempleComposant1.tsx # EXEMPLE - Composant login 1
│  │  │  └─ ExempleComposant2.tsx # EXEMPLE - Composant login 2
│  │  ├─ hooks/                 # Hooks SPÉCIFIQUES à la page login
│  │  │  ├─ ExempleHook1.ts     # EXEMPLE - Hook login 1
│  │  │  └─ ExempleHook2.ts     # EXEMPLE - Hook login 2
│  │  ├─ lib/                   # Libs SPÉCIFIQUES à la page login
│  │  │  ├─ ExempleLib1.ts      # EXEMPLE - Lib login 1
│  │  │  └─ ExempleLib2.ts      # EXEMPLE - Lib login 2
│  │  ├─ page.tsx               # AUTH - Page de connexion principale
│  │  └─ types.ts               # AUTH - Types spécifiques à login
│  │
│  ├─ dashboard/                # EXEMPLE DE FONCTIONNALITÉ (Route: /dashboard) - PROTÉGÉE
│  │  ├─ components/            # Composants SPÉCIFIQUES à la page principale
│  │  │  ├─ ExempleComposant1.tsx # EXEMPLE - Composant dashboard 1
│  │  │  └─ ExempleComposant2.tsx # EXEMPLE - Composant dashboard 2
│  │  ├─ hooks/                 # Hooks SPÉCIFIQUES au dashboard
│  │  │  ├─ ExempleHook1.ts     # EXEMPLE - Hook dashboard 1
│  │  │  └─ ExempleHook2.ts     # EXEMPLE - Hook dashboard 2
│  │  ├─ lib/                   # Libs SPÉCIFIQUES au dashboard
│  │  │  ├─ ExempleLib1.ts      # EXEMPLE - Lib dashboard 1
│  │  │  └─ ExempleLib2.ts      # EXEMPLE - Lib dashboard 2
│  │  ├─ settings/              # EXEMPLE - SOUS-PAGE (Route: /dashboard/settings) - PROTÉGÉE
│  │  │  ├─ components/         # Composants SPÉCIFIQUES à la sous-page
│  │  │  │  ├─ ExempleComposant1.tsx # EXEMPLE - Composant settings 1
│  │  │  │  └─ ExempleComposant2.tsx # EXEMPLE - Composant settings 2
│  │  │  ├─ hooks/              # Hooks SPÉCIFIQUES à la sous-page
│  │  │  │  ├─ ExempleHook1.ts  # EXEMPLE - Hook settings 1
│  │  │  │  └─ ExempleHook2.ts  # EXEMPLE - Hook settings 2
│  │  │  ├─ lib/                # Libs SPÉCIFIQUES à la sous-page
│  │  │  │  ├─ ExempleLib1.ts   # EXEMPLE - Lib settings 1
│  │  │  │  └─ ExempleLib2.ts   # EXEMPLE - Lib settings 2
│  │  │  ├─ page.tsx            # EXEMPLE - Page de la sous-page
│  │  │  └─ types.ts            # EXEMPLE - Types spécifiques à settings
│  │  ├─ page.tsx               # EXEMPLE - Page principale
│  │  ├─ layout.tsx             # EXEMPLE - Layout pour toute la fonctionnalité
│  │  └─ types.ts               # EXEMPLE - Types spécifiques à dashboard
│  │
│  ├─ globals.css               # Styles globaux de l'application
│  ├─ layout.tsx                # ROOT - Layout principal avec SessionProvider
│  └─ page.tsx                  # ROOT - Page d'accueil (redirige selon auth)
├─ middleware.ts                # AUTH - Protection des routes (/dashboard/*) (OBLIGATOIRE à la racine)
├─ docker-compose.yml           # DATABASE - Configuration PostgreSQL + pgAdmin
├─ .env                         # CONFIG - Variables d'environnement (sensibles)
├─ .env.example                 # CONFIG - Template des variables d'environnement
├─ .gitignore                   # CONFIG - Fichiers ignorés par Git
├─ package.json                 # CONFIG - Dépendances et scripts npm
├─ tsconfig.json                # CONFIG - Configuration TypeScript  
├─ next.config.ts               # CONFIG - Configuration Next.js
├─ tailwind.config.ts           # CONFIG - Configuration Tailwind CSS
├─ postcss.config.mjs           # CONFIG - Configuration PostCSS
├─ rules/                       # DOC - Documentation et règles du projet
│  ├─ rules.md                  # DOC - Architecture et conventions (ce fichier)
│  └─ tech-stack.md             # DOC - Stack technique détaillé
└─ README.md                    # DOC - Documentation du projet
```

---

## 2. Convention de Nommage des Fichiers

Pour une fonctionnalité `[nom]`, respecter cette convention stricte :

### **Hooks React :**
- **Format :** `use[Nom].ts` (PascalCase après "use")
- **Exemples :** `useAuth.ts`, `useDashboard.ts`, `useUser.ts`
- **Règle :** TOUJOURS commencer par "use" (convention React obligatoire)

### **Librairies/Utilitaires :**
- **Format :** `[nom].ts` (camelCase)
- **Exemples :** `auth.ts`, `dashboard.ts`, `user.ts`
- **Règle :** Nom simple et explicite de la fonctionnalité

### **Types TypeScript :**
- **Format :** `[nom].ts` (camelCase)
- **Exemples :** `auth.ts`, `dashboard.ts`, `user.ts`
- **Règle :** Même nom que le fichier lib correspondant

### **Exemple complet pour une fonctionnalité "user-management" :**
```
user-management/
├─ hooks/useUser.ts          # Hook pour gestion utilisateurs
├─ lib/user.ts               # Fonctions utilitaires utilisateurs
└─ types.ts                  # Types spécifiques à user-management
```

---

## 3. Configuration Authentification (NextAuth + Google)

### **Variables d'environnement requises (.env) :**
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **Structure d'authentification implémentée :**
- **Route API** : `/api/auth/[...nextauth]/route.ts` (OBLIGATOIRE pour NextAuth)
- **Configuration** : `_shared/lib/auth.ts` (authOptions partagées)
- **Types** : `_shared/types/auth.ts` (interfaces TypeScript)
- **Hook client** : `_shared/hooks/useAuth.ts` (gestion état auth)
- **Provider** : `_shared/components/SessionProvider.tsx` (wrapper client)
- **Middleware** : `middleware.ts` (protection routes)
- **Pages** : `/login` (connexion) et `/dashboard` (protégée)

---

## 4. Configuration Base de Données (Prisma + PostgreSQL + Docker)

### **Variables d'environnement requises (.env) :**
```
DATABASE_URL="postgresql://repricer_user:repricer_password@localhost:5432/repricer_db?schema=public"
```

### **Structure de base de données implémentée :**
- **Schéma** : `prisma/schema.prisma` (modèles User, Account, Session, VerificationToken)
- **Client** : `_shared/database/client.ts` (singleton Prisma avec configuration optimisée)
- **Types** : `_shared/database/types.ts` (réexport des types Prisma + utilitaires)
- **Requêtes** : `_shared/database/queries/[model].ts` (fonctions CRUD organisées par modèle)
- **Hook client** : `_shared/hooks/useDatabase.ts` (opérations côté client via API)
- **API** : `/api/users` (endpoints REST pour gestion utilisateurs)
- **Adapter** : NextAuth configuré avec PrismaAdapter pour session DB

### **Commandes essentielles :**
```bash
# Docker
npm run db:start           # Démarre PostgreSQL + pgAdmin
npm run db:stop            # Arrête les conteneurs

# Prisma  
npm run db:generate        # Génère le client TypeScript
npm run db:push           # Synchronise le schéma avec la DB
npm run db:studio         # Interface graphique Prisma Studio
```

### **Accès aux interfaces :**
- **Prisma Studio** : http://localhost:5555 (après `npm run db:studio`)
- **pgAdmin** : http://localhost:5050 (admin@repricer.com / admin123)

---

## 5. Règles de Développement

### **Éviter npm run dev automatique :**
- **RÈGLE IMPÉRATIVE** : Ne PAS exécuter `npm run dev` après chaque modification
- **Contexte** : L'utilisateur a généralement déjà l'application lancée sur le port 3000
- **Exception** : Lancer `npm run dev` UNIQUEMENT si c'est explicitement nécessaire pour tester une fonctionnalité critique
- **Bonne pratique** : Indiquer simplement que les modifications ont été apportées et sont prêtes à être testées

### **Éviter la création de documentation automatique :**
- **RÈGLE IMPÉRATIVE** : Ne JAMAIS créer de fichiers de documentation (.md, README, etc.) à moins que l'utilisateur le demande explicitement
- **Contexte** : L'utilisateur gère sa propre documentation et n'a pas besoin de fichiers supplémentaires non sollicités
- **Exception** : Créer de la documentation UNIQUEMENT si c'est explicitement demandé par l'utilisateur
- **Bonne pratique** : Se concentrer sur le code fonctionnel plutôt que sur la documentation

### **Code propre - Commentaires et logs :**
- **RÈGLE IMPÉRATIVE** : Ne JAMAIS ajouter de commentaires ou de logs console dans le code
- **Contexte** : Le code doit rester propre et lisible sans commentaires superflus
- **Interdictions** :
  - `console.log()`, `console.error()`, `console.warn()`, etc.
  - Commentaires `//` ou `/* */` explicatifs
  - Commentaires JSX `{/* */}`
  - Logs de debug ou de développement
- **Exception UNIQUE** : Ajouter des commentaires/logs UNIQUEMENT si l'utilisateur le demande explicitement
- **Outils disponibles** : Utiliser `npm run clean:code` pour nettoyer automatiquement le code existant (script dans `scripts/cleanup-code.js`)
- **Bonne pratique** : Écrire du code auto-documenté avec des noms de variables et fonctions explicites

### **Gestion Git et déploiement :**
- **RÈGLE IMPÉRATIVE** : Ne JAMAIS exécuter `git push`
- **Contexte** : L'utilisateur gère lui-même les push depuis GitHub Desktop
- **Autorisation** : Commits locaux (`git add` + `git commit`) autorisés pour organiser le travail
- **Déploiement** : Utiliser `./deploy.sh` pour déployer sur le VPS après que l'utilisateur ait pushé

### **Couleurs et design :**
- **RÈGLE IMPÉRATIVE** : TOUJOURS utiliser les couleurs CSS personnalisées définies dans `src/app/globals.css`
- **Contexte** : Le projet utilise un système de couleurs cohérent avec support automatique du dark mode
- **Utilisation** : Utiliser les classes Tailwind correspondantes : `bg-background`, `text-foreground`, `border-border`, etc.
- **Interdictions** :
  - Couleurs hardcodées : `#ffffff`, `rgb(255,255,255)`, `hsl(0,0%,100%)`, etc.
  - Classes Tailwind avec couleurs fixes : `bg-white`, `text-black`, `border-gray-200`, etc.
- **Exception** : Utiliser des couleurs hardcodées UNIQUEMENT si explicitement demandé par l'utilisateur
- **Bonne pratique** : Respecter le système de design pour maintenir la cohérence visuelle et le support automatique des thèmes

### **Espacement et layout :**
- **RÈGLE IMPÉRATIVE** : Privilégier l'utilisation de `gap` pour l'espacement entre éléments
- **Contexte** : `gap` est plus moderne, prévisible et maintenable que `space-*`, `margin` ou `padding` pour l'espacement entre éléments
- **Utilisation recommandée** :
  - `flex flex-col gap-4` au lieu de `space-y-4`
  - `flex gap-2` au lieu de marges entre éléments
  - `grid gap-6` pour les grilles
- **Garder `margin` et `padding` uniquement pour** :
  - L'espacement interne d'un composant (`p-4`, `px-6`, `py-3`)
  - Les positionnements absolus (`mb-2` pour décaler un élément spécifique)
  - Les cas où `gap` ne s'applique pas (éléments non dans un container flex/grid)
- **Bonne pratique** : Utiliser `gap` dès qu'on a plusieurs éléments enfants à espacer dans un conteneur
