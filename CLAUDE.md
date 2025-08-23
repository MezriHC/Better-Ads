# Claude Rules - Template Universel

**Guide de référence dédié à l'IA Claude Code** pour tous les projets Next.js avec authentification et base de données.

⚠️ **INSTRUCTIONS CLAUDE :**
- **RESPECTER** toutes les règles de ce fichier de façon stricte
- **JUSTIFIER** tes choix en citant les règles précises
- **NE JAMAIS MODIFIER** ce fichier sans autorisation explicite de l'utilisateur
- **SUGGERER** des améliorations en fin de conversation si tu détectes confusions/problèmes

---

## 1. 🏗️ Architecture & Organisation

### Structure modulaire

**⚠️ RÉFÉRENCE** : Cette arborescence est un **exemple type** à suivre pour organiser tes nouveaux fichiers et features.

```
src/app/
├─ _shared/                     # CODE RÉUTILISABLE (MAX 40 fichiers)
│  ├─ core/                     # Services fondamentaux (MAX 10 fichiers)
│  │  ├─ auth-global.service.ts # Configuration et logique auth NextAuth
│  │  ├─ api-global.service.ts  # Client HTTP et gestion erreurs
│  │  ├─ entity-global.service.ts # CRUD entités avec permissions
│  │  ├─ database-client.ts     # Singleton client Prisma
│  │  └─ [domain]-global.service.ts # Services critiques autres domaines
│  ├─ ui-kit/                   # Composants atomiques purs (MAX 15 fichiers)
│  │  ├─ Button.tsx             # Bouton sans logique métier
│  │  ├─ Input.tsx              # Input sans validation
│  │  ├─ Card.tsx               # Container sans données
│  │  ├─ Modal.tsx              # Overlay sans contenu métier
│  │  └─ [component].tsx        # Composants design system
│  ├─ business/                 # Logique métier cross-feature (MAX 8 fichiers)
│  │  ├─ validation-shared.ts   # Règles validation Zod communes
│  │  ├─ permissions-shared.ts  # Logique autorisation entités
│  │  ├─ formatting-shared.ts   # Transformation données affichage
│  │  ├─ item-picker.component.tsx # Sélecteur items avec API
│  │  └─ [domain]-shared.ts     # Logique métier autres domaines
│  ├─ config/                   # Configuration application (MAX 5 fichiers)
│  │  ├─ constants-global.ts    # Constantes invariables projet
│  │  ├─ types-global.ts        # Types TypeScript communs
│  │  ├─ env-config.ts          # Variables environnement typées
│  │  └─ app-config.ts          # Configuration runtime application
│  ├─ layouts/                  # Structures page réutilisables (MAX 3 fichiers)
│  │  ├─ main-layout.tsx        # Structure avec sidebar navigation
│  │  ├─ auth-layout.tsx        # Structure pages connexion
│  │  └─ admin-layout.tsx       # Structure interface spécialisée
│  └─ index.ts                  # Export unique tous éléments _shared
│
├─ api/                         # ROUTES API Next.js App Router
│  ├─ auth/[...nextauth]/       # Handler NextAuth avec providers OAuth
│  │  └─ route.ts               # Configuration authOptions export GET/POST
│  ├─ entities/                 # Endpoints gestion entités
│  │  ├─ route.ts               # GET/POST entités avec auth
│  │  └─ [id]/route.ts          # GET/PATCH/DELETE par ID entité
│  └─ [feature]/                # Endpoints spécifiques feature
│     ├─ route.ts               # Handlers HTTP avec validation
│     ├─ services.ts            # Logique métier API isolée
│     └─ types.ts               # Types requêtes/réponses
│
├─ login/                       # PAGE CONNEXION (Route /login)
│  ├─ components/               # Composants page connexion
│  │  ├─ ui/                    # Boutons/inputs sans logique auth
│  │  ├─ sections/              # Formulaire/header avec logique
│  │  └─ LoginMain.tsx          # Assemblage page complète
│  ├─ services/                 # Logique validation connexion
│  ├─ schemas/                  # Validation formulaires Zod
│  ├─ constants/                # Messages/URLs page connexion
│  ├─ assets/                   # Logos/images spécifiques connexion
│  ├─ __tests__/                # Tests composants et logique
│  ├─ page.tsx                  # Import LoginMain.tsx uniquement
│  └─ types.ts                  # Types business connexion
│
├─ [feature]/                   # FONCTIONNALITÉ MÉTIER COMPLÈTE
│  │                            # ⚠️ IMPORTANT : Une feature peut contenir TOUTES ses pages
│  │                            # EXEMPLE dashboard : dashboard/home/, dashboard/settings/, dashboard/profile/
│  │                            # RÈGLE : Toutes les pages d'un même domaine métier ensemble
│  ├─ components/               # Composants métier feature
│  │  ├─ ui/                    # Styles feature sans logique métier
│  │  │  ├─ FeatureButton.tsx   # Bouton stylé feature sans API
│  │  │  ├─ FeatureCard.tsx     # Card stylée feature sans données
│  │  │  └─ FeatureModal.tsx    # Modal stylée feature sans contenu
│  │  ├─ sections/              # Assemblages avec logique métier
│  │  │  ├─ Header.tsx          # Header avec navigation feature
│  │  │  ├─ Sidebar.tsx         # Sidebar avec état feature
│  │  │  └─ Content.tsx         # Contenu avec données feature
│  │  ├─ EntityList.tsx         # Liste entités avec API/tri
│  │  ├─ DataTable.tsx          # Tableau données avec pagination/tri
│  │  └─ [Feature]Main.tsx      # Assemblage page complète feature
│  ├─ hooks/                    # Hooks React spécifiques feature
│  │  └─ use[Feature].ts        # État/logique feature côté client
│  ├─ services/                 # Logique métier feature
│  │  └─ [feature]-local.service.ts # Business logic spécifique feature
│  ├─ config/                   # Configuration environnement feature
│  │  ├─ development.ts         # Paramètres dev feature
│  │  ├─ production.ts          # Paramètres prod feature
│  │  └─ index.ts               # Export config selon NODE_ENV
│  ├─ guards/                   # Protection accès feature
│  │  └─ [feature]-auth.guard.ts # Vérification permissions feature
│  ├─ lib/                      # Utilitaires feature
│  │  └─ [feature]-utils.ts     # Fonctions helper feature
│  ├─ schemas/                  # Validation Zod feature
│  │  └─ [feature]-validation.schema.ts # Rules validation feature
│  ├─ constants/                # Constantes feature
│  │  └─ [feature]-config.constants.ts # Valeurs fixes feature
│  ├─ assets/                   # Ressources statiques feature
│  │  ├─ images/                # Images spécifiques feature
│  │  └─ icons/                 # Icons spécifiques feature
│  ├─ __tests__/                # Tests unitaires feature
│  │  ├─ components/            # Tests composants feature
│  │  ├─ services/              # Tests logique métier feature
│  │  └─ [feature].test.tsx     # Tests intégration feature
│  ├─ [sub-feature]/            # Sous-feature si >5 composants
│  │  ├─ components/            # Structure identique feature
│  │  │  ├─ ui/                 # UI pure sous-feature
│  │  │  ├─ sections/           # Sections avec logique sous-feature
│  │  │  └─ [SubFeature]Main.tsx # Assemblage sous-feature
│  │  ├─ services/              # Services sous-feature
│  │  ├─ config/                # Config sous-feature
│  │  ├─ guards/                # Guards sous-feature
│  │  ├─ schemas/               # Validation sous-feature
│  │  ├─ constants/             # Constantes sous-feature
│  │  ├─ assets/                # Assets sous-feature
│  │  ├─ __tests__/             # Tests sous-feature
│  │  ├─ page.tsx               # Page sous-feature
│  │  └─ types.ts               # Types sous-feature
│  ├─ middleware.ts             # Middleware protection route feature
│  ├─ page.tsx                  # Page feature import [Feature]Main.tsx
│  ├─ layout.tsx                # Layout wrapping feature si nécessaire
│  └─ types.ts                  # Types TypeScript métier feature
│
├─ layout.tsx                   # Layout racine application SessionProvider
├─ page.tsx                     # Page accueil redirection selon auth
└─ globals.css                  # Variables CSS custom + Tailwind config
```

### Convention de nommage

**PATTERN** : `[domain]-[scope].[type].ts`

```
// Services
entity-global.service.ts      # Service entité partagé
entity-feature.service.ts     # Service entité feature
auth-shared.service.ts        # Service auth partagé

// Hooks  
entity-feature.hook.ts        # Hook entité feature
form-validation.hook.ts       # Hook validation formulaire
api-mutation.hook.ts          # Hook mutation API

// Utils
date-formatting.util.ts       # Utilitaire formatage dates
string-validation.util.ts     # Utilitaire validation strings

// Components
item-picker.component.tsx     # Composant métier sélecteur item
data-table.component.tsx      # Composant métier tableau données

// Schemas & Types
entity-validation.schema.ts   # Schema validation entité  
api-responses.types.ts        # Types réponses API
business-rules.types.ts       # Types règles métier

// Constants
entity-roles.constants.ts     # Constantes rôles entité
api-endpoints.constants.ts    # Constantes endpoints API
```

### Règles de création feature

**CRÉER nouvelle feature SI :**
- Fonctionnalité métier distincte (main-app, admin-panel, public-site)
- OU logique technique complexe (notifications, auth-system, file-upload)
- OU plus de 3 composants liés au même domaine
- OU système réutilisable (messaging, comments, payments)

**RÈGLE IMPORTANTE - Organisation des pages :**
- **SI tu as un dashboard** → Créer dossier `dashboard/`
- **TOUTES les pages du dashboard** → Sous `dashboard/` (home, settings, profile, analytics, etc.)
- **MÊME LOGIQUE pour autres domaines** : `admin/`, `shop/`, `auth-system/`
- **PRINCIPE** : Regrouper logiquement toutes les pages d'un même domaine métier

**CRÉER sub-feature SI :**
- Plus de 5 composants dans une feature
- Logique distincte mais liée à feature parent
- Page secondaire complexe avec ses propres composants

**EXEMPLES features SANS pages :**
- `auth-system/` → Services auth, hooks, guards, middlewares
- `notifications/` → Système notifications, composants, hooks
- `file-upload/` → Upload logic, composants, validation
- `messaging/` → Chat system, websockets, composants

**TEMPLATE création :**
1. Créer dossier `[feature]/`
2. SI page → Créer `page.tsx` + `[Feature]Main.tsx`
3. SI système → Créer directement services/hooks/components
4. Créer structure selon besoins

### Règles d'interdépendances

**IMPORTS AUTORISÉS :**
- Feature → `_shared/*` (toujours)
- Feature → API de la même feature
- Sub-feature → Feature parent
- `components/` → `ui/` (dépendance à sens unique)
- `components/` → `_shared/ui/` (composants atomiques globaux)

**IMPORTS INTERDITS :**
- Feature A → Feature B (directement)
- Feature → Composants d'une autre feature
- `ui/` → `components/` (JAMAIS, dépendance inversée)
- `ui/` → hooks, services, API (ZERO logique métier)

**RÈGLES ui/ vs components/ :**
- **ui/** = Composants atomiques PURS (Button, Input, Card)
  - ZERO logique métier
  - ZERO appels API
  - ZERO validation métier
  - Seulement styles et props de base
- **components/** = Composants métier (ItemPicker, DataTable)
  - Logique métier autorisée
  - Appels API autorisés
  - Validation métier autorisée

**NOMMAGE par rôle :**
- **ui/** : `Button`, `Input`, `Modal` (rôle générique)
- **components/** : `ItemPicker`, `DataCard`, `ContentTable` (rôle métier)

**COLOCALISATION :**
- Composant spécifique à UNE page/feature → dans cette feature
- Composant réutilisé entre features → dans `_shared/`

**SOLUTION pour réutilisation :**
- Déplacer composant vers `_shared/components/` (métier) ou `_shared/ui/` (atomique)
- Créer hook global dans `_shared/hooks/`

### 🤖 Processus de Décision

**⚠️ AVANT TOUTE IMPLÉMENTATION :**

1. **ANALYSER la demande :**
   - Où créer ce fichier selon l'architecture ?
   - Est-ce ui/ (atomique) ou components/ (métier) ?
   - Est-ce nouvelle feature ou extension existante ?
   - Quelles règles d'interdépendance s'appliquent ?

2. **JUSTIFIER ton choix :**
   - "Je crée dans [dossier] parce que [règle CLAUDE.md]"
   - "C'est ui/ car aucune logique métier selon règle X"
   - "C'est components/ car appel API selon règle Y"

3. **ANTICIPER l'évolution :**
   - "Si logique métier ajoutée → migration vers components/"
   - "Si réutilisé entre features → migration vers _shared/"

### 🔄 Architecture Modulaire & Migration

**PRINCIPE** : L'architecture est **évolutive**. Un composant peut changer de place selon son évolution.

**ARBRES DE DÉCISION OBLIGATOIRES :**

#### **Où créer un composant ?**
```
Le composant fait-il des appels API ?
├─ OUI → components/ (logique métier)
├─ NON → A-t-il de la validation métier ?
   ├─ OUI → components/ (logique métier)
   ├─ NON → Gère-t-il un état complexe ?
      ├─ OUI → components/ (logique métier)
      └─ NON → ui/ (atomique pur)
```

#### **Nouvelle feature ou existante ?**
```
La demande concerne :
├─ Route principale (/main-app, /admin-panel, /public-site) → Nouvelle feature
├─ Système technique (auth, notifications, upload) → Nouvelle feature
├─ Logique métier distincte (users vs products) → Nouvelle feature
├─ Extension feature existante → Dans feature existante
└─ Page secondaire (/main-app/settings) → Sub-feature si >5 composants
```

#### **Critères de migration obligatoire :**
```
MIGRER de ui/ vers components/ SI :
├─ Ajout d'appel API
├─ Ajout de validation métier  
├─ Ajout d'état complexe
└─ Logique métier quelconque

MIGRER vers _shared/ SI :
├─ Réutilisé dans 2+ features
├─ Demande de réutilisation explicite
└─ Composant devenu générique
```

### 📝 Convention de Nommage STRICTE

**Features** : `kebab-case` (user-management, product-catalog)
**Fichiers** : `camelCase` (userService.ts, productSchema.ts)  
**Composants** : `PascalCase` (ItemPicker.tsx, DataCard.tsx)
**Dossiers** : `kebab-case` (sub-features, multi-mots)

### 🚨 Règles de Fallback

**EN CAS D'INCERTITUDE :**
1. **Privilégie toujours** feature existante vs nouvelle
2. **Privilégie toujours** ui/ vs components/ (migre plus tard si besoin)
3. **Privilégie toujours** local vs _shared/ (migre plus tard si besoin)
4. **Demande toujours** précision avant création si ambiguïté

**PHRASES OBLIGATOIRES :**
- "Selon CLAUDE.md, je [action] parce que [règle précise]"
- "Si évolution future vers [cas], migration nécessaire vers [destination]"

### 🚫 Règles ANTI-DUPLICATION

**PROBLÈME** : L'isolation des features peut créer de la duplication massive de code et logique métier.

**PRINCIPE** : Ne JAMAIS dupliquer la logique métier entre features.

#### **Règle des "3 Fois" - Cycle de Factorisation**

**1️⃣ PREMIÈRE fois (Création) :**
```
Besoin : Fonction formatItem dans feature-a/
Action : Créer feature-a/lib/itemUtils.ts
Statut : ✅ AUTORISÉ (création locale)
```

**2️⃣ DEUXIÈME fois (Refactoring obligatoire) :**
```
Besoin : Même fonction formatItem dans feature-b/
Action : NE PAS recréer ! 
       → Déplacer feature-a/lib/itemUtils.ts vers _shared/lib/itemUtils.ts
       → Importer depuis _shared/ dans feature-a/ ET feature-b/
Statut : 🔄 REFACTORING OBLIGATOIRE
```

**3️⃣ TROISIÈME fois et + (Réutilisation) :**
```
Besoin : Même fonction dans profile/
Action : Importer depuis _shared/lib/itemUtils.ts
Statut : ♻️ RÉUTILISATION OBLIGATOIRE (jamais recréer)
```

#### **Checklist AVANT création :**

**⚠️ AVANT de créer service/hook/util/constant, L'IA DOIT :**

1. **Vérifier existence** :
   - Cette logique existe-t-elle dans `_shared/` ?
   - Cette logique existe-t-elle dans une autre feature ?

2. **Si EXISTE** :
   - ✅ Réutiliser depuis `_shared/`
   - ✅ Ou importer depuis feature existante puis refactorer vers `_shared/`

3. **Si NOUVEAU** :
   - ✅ Créer localement dans la feature
   - ✅ Documenter pour future factorisation

#### **Patterns de Factorisation Automatique**

**DÉPLACER vers _shared/ dès la 2ème utilisation :**

```
Services critiques → _shared/core/
├─ entity-global.service.ts    # Service entité global
├─ auth-global.service.ts      # Service auth principal  
└─ api-global.service.ts       # Client API principal

Logique métier → _shared/business/  
├─ validation-shared.ts        # Validations communes
├─ permissions-shared.ts       # Système permissions
├─ formatting-shared.ts        # Formatage données
└─ item-picker.component.tsx   # Composants métier

Configuration → _shared/config/
├─ constants-global.ts         # Constantes globales
├─ types-global.ts             # Types globaux
└─ env-config.ts               # Configuration environnement

UI Atomique → _shared/ui-kit/
├─ Button.tsx                  # Composants atomiques purs
├─ Input.tsx                   # Zero logique métier
└─ Modal.tsx                   # Design system uniquement
```

#### **Règles d'Import Cross-Feature TEMPORAIRE**

**EN ATTENDANT le refactoring vers _shared/ :**

```
AUTORISÉ TEMPORAIREMENT (max 24h) :
- feature-a → feature-b/lib/utils.ts
- feature-a → feature-b/services/service.ts

PUIS OBLIGATOIRE :
- Déplacer la logique vers _shared/
- Refactorer les deux features pour utiliser _shared/
```

**PHRASES OBLIGATOIRES pour la factorisation :**
- "Cette logique existe déjà dans [feature/shared], je vais la réutiliser"
- "2ème utilisation détectée → refactoring vers _shared/ nécessaire"  
- "Logique déplacée vers _shared/ pour éviter duplication future"

### 🔍 Checklist OBLIGATOIRE avant création

**⚠️ AVANT création fichier EXÉCUTE :**

```bash
# 1. Chercher logique similaire
grep -r "function [nomFonction]" src/ --include="*.ts" --include="*.tsx"

# 2. Chercher fichiers similaires  
find src/ -name "*[domain]*[type]*" -type f

# 3. Vérifier _shared/index.ts
grep "[nomLogique]" src/_shared/index.ts
```

**TROUVÉ → RÉUTILISE | NOUVEAU → Crée avec convention**

**PHRASES OBLIGATOIRES :**
- "J'ai exécuté grep '[pattern]' et trouvé : [résultats]"
- "J'ai vérifié _shared/index.ts et [trouvé/pas trouvé] [logique]"


### 🎯 Limites _shared/

**MAX par dossier :**
- `core/` MAX 10 fichiers
- `ui-kit/` MAX 15 composants  
- `business/` MAX 8 fichiers
- `config/` MAX 5 fichiers
- `layouts/` MAX 3 fichiers
- **TOTAL MAX 40 fichiers**

**Dépassement → AUDIT :**
- >10 core → Questionner architecture
- >15 ui → Audit design system
- >8 business → Créer feature
- >40 total → Refactoring

### 📦 Export Central

**_shared/index.ts :**
```typescript
export * from './core/auth-global.service'
export * from './core/entity-global.service'
export * from './ui-kit/Button'
export * from './business/validation-shared'
```

**Import :**
```typescript
// ✅ CORRECT
import { entityGlobalService, Button } from '@/_shared'

// ❌ INTERDIT  
import { entityGlobalService } from '@/_shared/core/entity-global.service'
```

### ⚡ Tests Automatiques

**Créer [filename].test.ts SI :**
- Service avec logique métier
- Hook custom  
- Util avec calculs
- Component avec interactions

### 🔧 Paramètres vs Fonctions

**PRÉFÉRER paramètres (éviter duplication) :**
```typescript
// ✅ BON
function formatItem(item, options = { showDetails: true }) 

// ❌ ÉVITER 
function formatItemWithDetails(item)
function formatItemSimple(item)
```

---

## 2. 🛠️ Règles de Codage

### "use client" - Réflexion Obligatoire

**⚠️ AVANT d'ajouter "use client" :**

**POSE-TOI LA QUESTION :**
- Ai-je besoin d'interactions client (onClick, useState, useEffect, hooks) ?
- Ai-je besoin d'accès au DOM (window, document) ?
- Le composant gère-t-il un état local ?

```typescript
// ❌ INTERDIT - use client systématique
"use client"
export function ItemList({ items }) {
  return <div>{items.map(...)}</div>
}

// ✅ CORRECT - Composant serveur (plus rapide)
export function ItemList({ items }) {
  return <div>{items.map(...)}</div>
}

// ✅ CORRECT - use client justifié
"use client"
export function SearchInput() {
  const [query, setQuery] = useState("")
  return <input onChange={(e) => setQuery(e.target.value)} />
}
```

**RÈGLE :** Composant serveur par défaut → "use client" uniquement si interactions

### Workflow Front-First avec Mock Data

**PRINCIPE :** Valider le front AVANT d'implémenter le backend

#### **PHASE 1 - Développement Front (Mock Data)**

```
src/app/_shared/mock/
├─ entities-mock.data.ts  # Données entités fictives
├─ items-mock.data.ts     # Données items fictives  
├─ api-mock.service.ts    # Réponses API simulées
└─ index.ts               # Export central mock
```

**PENDANT CETTE PHASE :**
- Développer UI complète avec mock data
- Valider interactions et design utilisateur
- ❌ **INTERDIT** d'implémenter vraies API
- ❌ **INTERDIT** de connecter base de données
- ✅ **AUTORISÉ** composants complexes pour validation

**CRÉATION mock data :**

```typescript
// _shared/mock/entities-mock.data.ts
export const mockEntities = [
  { id: 1, name: "Item One", email: "item1@example.com", image: "https://picsum.photos/64/64?random=1" },
  { id: 2, name: "Item Two", email: "item2@example.com", image: "https://picsum.photos/64/64?random=2" },
  { id: 3, name: "Item Three", email: "item3@example.com", image: "https://picsum.photos/64/64?random=3" }
]

// _shared/mock/items-mock.data.ts
export const mockItems = [
  { id: 1, title: "Content Alpha", value: 1299, image: "https://picsum.photos/300/200?random=10" },
  { id: 2, title: "Content Beta", value: 899, image: "https://picsum.photos/300/200?random=11" }
]

// _shared/mock/api-mock.service.ts  
export const mockApiService = {
  getEntities: () => new Promise(resolve => setTimeout(() => resolve(mockEntities), 500)),
  getItems: () => new Promise(resolve => setTimeout(() => resolve(mockItems), 300)),
  getEntity: (id: number) => Promise.resolve(mockEntities.find(e => e.id === id))
}
```

**RÈGLES mock data :**
- ✅ **Données riches** : Inclure images, tous champs nécessaires UI
- ✅ **Délais simulés** : setTimeout pour simuler latence réseau
- ✅ **Quantité réaliste** : 3-5 éléments minimum pour tester scroll/pagination
- ✅ **URLs images** : Utiliser picsum.photos pour images aléatoires
- ❌ **Pas de logique complexe** : Mock simple, pas de calculs compliqués

#### **PHASE 2 - Intégration Backend (Production)**

**DÉCLENCHEUR :** Utilisateur dit "intègre cette fonctionnalité" ou "connecte au backend"

**ACTIONS :**
- Remplacer imports mock par vrais services
- Implémenter vraies API routes
- Connecter base de données
- ✅ **GARDER** front intact (déjà validé)
- ✅ **SUPPRIMER** mock data utilisée

**TRANSITION :**
```typescript
// AVANT (Phase 1)
import { mockApiService } from '@/_shared/mock'
const entities = await mockApiService.getEntities()

// APRÈS (Phase 2)  
import { entityService } from '@/_shared/core/entity-global.service'
const entities = await entityService.getEntities()
```

### Anti-Contournement des Règles

**PROBLÈME :** Tu contournes les règles techniques pour "résoudre" rapidement

**INTERDICTIONS ABSOLUES :**
- ❌ Changer de tech stack sans permission utilisateur
- ❌ Ignorer l'architecture définie
- ❌ Créer failles sécurité pour contourner auth
- ❌ Installer nouvelles dépendances sans approbation
- ❌ Ajouter nouvelles bibliothèques sans demander

**RÈGLE TECH STACK :**
À chaque fois que tu veux ajouter une nouvelle bibliothèque ou changer le tech stack, tu dois **ABSOLUMENT demander à l'utilisateur avant**.

**EN CAS DE DIFFICULTÉ :**
1. **Respecter les règles** définies dans CLAUDE.md
2. **Chercher solution** dans contraintes existantes  
3. **Demander à l'utilisateur** si vraiment bloqué
4. **JAMAIS contourner** par facilité

**PHRASE OBLIGATOIRE si bloqué :**
"Je rencontre une difficulté avec [problème]. Les règles CLAUDE.md m'empêchent de [contournement]. Peux-tu m'aider à résoudre dans les contraintes ?"

### Code Propre - ZÉRO Commentaire

**RÈGLE ABSOLUE :** JAMAIS de commentaires dans le code

**INTERDICTIONS :**
```typescript
// ❌ INTERDIT - Commentaires quelconques
// Cette fonction calcule la somme
function calculateSum(a, b) { return a + b }

/* ❌ INTERDIT - Commentaires multilignes */
const user = { name: "John" }

{/* ❌ INTERDIT - Commentaires JSX */}
<div>Content</div>

console.log("debug") // ❌ INTERDIT - Logs console
```

**POURQUOI :**
- Code doit être auto-documenté
- Noms variables/fonctions explicites suffisent
- Tu n'as pas besoin de commentaires pour comprendre
- Réduit taille fichiers

**SI commentaires existants → SUPPRIME-LES automatiquement**

### Scripts Automatiques - INTERDITS

**❌ JAMAIS exécuter automatiquement :**
- `npm run dev` (utilisateur l'a déjà lancé)
- `npm run build` (coûteux, utilisateur contrôle)
- `git push` (utilisateur gère avec GitHub Desktop)

**✅ À la place :**
- "Modifications appliquées, prêtes à tester"
- "Code mis à jour, vérifier dans navigateur"

**EXCEPTION unique :** Si utilisateur demande explicitement

### Git Push - INTERDIT

**❌ JAMAIS exécuter :**
- `git push` (utilisateur gère déploiement)
- `git push origin main` (utilisateur contrôle avec GitHub Desktop)

**✅ AUTORISÉ :**
- `git add` et `git commit` pour organiser le travail
- Regrouper changements liés en commits logiques

**RÈGLE :** L'utilisateur gère lui-même les push depuis son interface Git

### Documentation - INTERDITE

**❌ JAMAIS créer :**
- Fichiers .md
- README.md  
- Documentation.md
- Comments dans code

**SAUF si utilisateur demande explicitement**

---

## 3. 🎨 Design System

### Couleurs - Variables CSS Custom

**TOUJOURS utiliser variables CSS custom :**
```typescript
// ✅ CORRECT
<div className="bg-background text-foreground border-border">

// ❌ INTERDIT  
<div className="bg-white text-black border-gray-200">
<div style={{ color: "#ffffff" }}>
```

**RÈGLE :** Respecter le système de design pour maintenir la cohérence visuelle et le support automatique des thèmes.

**MODIFICATION globals.css INTERDITE :**
- ❌ **JAMAIS** modifier `globals.css` sans permission
- ✅ **TOUJOURS** demander avant d'ajouter nouvelles variables CSS
- ✅ **UTILISER** uniquement les variables existantes

**PHRASE OBLIGATOIRE :**
"J'ai besoin d'ajouter [nouvelle-variable] dans globals.css. Puis-je la créer ?"

### Espacement - Privilégier Gap

```typescript
// ✅ CORRECT
<div className="flex flex-col gap-4">
<div className="grid gap-6">

// ❌ ÉVITER
<div className="space-y-4">
<div className="mb-4 mt-2">
```

**Gap SAUF :**
- Espacement interne : `p-4`, `px-6`
- Positionnement absolu : `mb-2`
- Éléments non flex/grid

**PRINCIPE :** `gap` est plus moderne, prévisible et maintenable que `space-*`, `margin` ou `padding` pour l'espacement entre éléments.

### Interactions - Cursor Pointer

**TOUJOURS sur éléments cliquables :**
```typescript
// ✅ CORRECT
<button className="cursor-pointer">
<div onClick={handler} className="cursor-pointer">

// ❌ MANQUE cursor-pointer
<button>Click me</button>
```

**UTILISATION OBLIGATOIRE sur :**
- Tous les boutons (`<button>`)
- Tous les liens (`<a>`)
- Tous les éléments avec `onClick`, `onSubmit`, etc.
- Tous les éléments interactifs (cartes cliquables, etc.)

**EXCEPTION :** Les éléments désactivés peuvent utiliser `cursor-not-allowed`

### Conventions Tailwind

**PRÉFÉRER :**
- Variables CSS custom over couleurs hardcodées
- `gap` over `space-*` pour l'espacement
- `cursor-pointer` sur tous éléments interactifs
- Noms de classes explicites et cohérents

---

## 4. ⚙️ Stack & Configuration

### Technologies imposées

**STACK TECHNIQUE OBLIGATOIRE :**
- **Next.js** - Framework React full-stack
- **Tailwind CSS** - Styling et design system  
- **Prisma** - ORM avec migrations automatiques
- **PostgreSQL** - Base de données principale
- **MinIO** - Stockage S3-compatible pour fichiers
- **NextAuth.js** - Authentification

**DÉPLOIEMENT :**
- **Docker** - Orchestration avec Dockerfile
- **Coolify** - Plateforme de déploiement
- **GitHub** - Repository et CI/CD
### Variables d'environnement

**FICHIER .env OBLIGATOIRE - Template de base :**

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-64-char-secret-key
NEXTAUTH_URL=http://localhost:3000

# Database PostgreSQL
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# OAuth Google (NextAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MinIO S3 Storage
MINIO_ENDPOINT=your-server:9000
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
MINIO_BUCKET_NAME=your-bucket-name
MINIO_USE_SSL=false

# Environment
NODE_ENV=development
```

**RÈGLE ENV :**
Ces variables doivent exister dans tous les projets SAUF si l'utilisateur indique explicitement qu'il n'utilise pas certains services (ex: pas de S3, pas d'auth Google, etc.)
### Configuration auth

**ARCHITECTURE NextAuth.js OBLIGATOIRE :**
1. `_shared/lib/auth.ts` - Configuration serveur avec PrismaAdapter
2. `api/auth/[...nextauth]/route.ts` - Handler API NextAuth
3. `_shared/components/SessionProvider.tsx` - Provider React client
4. `middleware.ts` - Protection routes côté serveur

**PROVIDERS :**
- Google OAuth (principal)
- Autres providers OAuth selon besoins projet

---

## 5. 🚀 Workflow Développement

### Processus dev → production

**ARCHITECTURE DÉVELOPPEMENT :**
- **PostgreSQL** - Sur serveur dédié avec Coolify (connexion directe)
- **MinIO S3** - Également en ligne sur le serveur
- **Code local** - Uniquement le code source en développement
- **Pas d'environnement local** - Connexion directe aux services distants

**WORKFLOW :**
1. **Développement local** - Code uniquement, connexion SSH au serveur
2. **Synchronisation directe** - Modifications appliquées aux services en ligne
3. **Push GitHub** - Déploiement automatique via Coolify
4. **Demander accès SSH** - L'IA doit toujours demander les credentials de connexion serveur
### Scripts npm

**SCRIPTS OBLIGATOIRES package.json :**
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:generate": "prisma generate",
  "db:push": "prisma db push",
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio"
}
```

### Gestion DB et migrations

**DÉVELOPPEMENT :** `db:push` pour prototypage rapide
**PRODUCTION :** `db:migrate` pour créer migrations officielles
**INTERFACE :** `db:studio` pour visualiser données (localhost:5555)

---

## 6. 📝 Feedback & Améliorations

**SI tu rencontres des difficultés avec ce guide :**

⚠️ **EN CAS DE CONFUSION/PROBLÈME :**
- **CONTINUE** à suivre les règles existantes
- **NOTE** mentalement les difficultés rencontrées
- **SUGGERE** à la fin de la conversation :

**TEMPLATE SUGGESTION :**
📝 "Suggestion d'amélioration CLAUDE.md : [section concernée] - [problème identifié] - [amélioration proposée]"

**EXEMPLES :**
- 📝 "Section Architecture : Règle ui/ vs components/ pas assez claire - Ajouter plus d'exemples concrets"
- 📝 "Section Stack : Manque info sur gestion erreurs Prisma - Ajouter troubleshooting DB"

**RÈGLE :** Jamais modifier ce fichier, seulement suggerer améliorations.