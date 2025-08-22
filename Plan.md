# Plan d'Implémentation Final : Génération d'Avatars

**Statut :** Finalisé
**Version :** 1.0.0

## 1. Objectif Principal

Implémenter le workflow backend complet pour la création, le stockage et la gestion des **Avatars Privés**. Un utilisateur doit pouvoir générer un avatar à partir d'une image (générée, modifiée ou uploadée) et le voir apparaître dans son interface.

### Principe Directeur
Ce document est la source de vérité unique pour l'implémentation de cette fonctionnalité. Il contient le contexte, les exigences techniques et le plan d'action détaillé.

---

## 2. Parcours Utilisateur Détaillé

1.  **Phase de Sélection d'Image :**
    a. L'utilisateur, dans un projet, décide de créer un avatar.
    b. Il peut générer une image via un prompt (**text-to-image**).
    c. Il peut uploader sa propre image.
    d. Il peut sélectionner une image (générée ou uploadée) et la modifier avec un prompt (**image-to-image**).
    e. **À la fin de ce processus, une seule image est choisie comme "image de référence" finale.**

2.  **Phase de Génération de l'Avatar :**
    a. L'utilisateur nomme son avatar et clique sur "Générer".
    b. Le frontend affiche immédiatement le nouvel avatar dans l'interface avec un statut "en cours".
    c. Une fois la génération terminée, l'avatar est mis à jour et la vidéo est visible.
    d. En cas d'échec, l'avatar affiche un statut d'erreur.

---

## 3. Architecture et Flux de Données

Voici le flux technique complet, étape par étape, de la création d'un avatar.

**Étape 1 : Upload de l'Image de Référence**
1.  Le **Frontend** a l'image de référence finale (en format `File`).
2.  Il appelle notre backend sur `POST /api/uploads` pour demander l'autorisation d'uploader.
3.  Le **Backend** (`uploads/services.ts`) utilise `minio.ts` pour générer une **URL d'upload sécurisée (signed URL)** pour MinIO et la retourne au frontend.
4.  Le **Frontend** utilise cette URL pour uploader l'image directement vers le bucket **MinIO**, dans un chemin temporaire.

**Étape 2 : Lancement de la Génération**
1.  Une fois l'upload terminé, le **Frontend** appelle `POST /api/avatars`.
2.  Le **Corps de la requête** contient : `{ name: string, imageUrl: string, projectId: string }` où `imageUrl` est le chemin de l'image sur MinIO.
3.  Le **Backend** (`avatars/services.ts`) :
    a. Appelle `falAi.ts` pour démarrer le job **image-to-video** sur `fal.ai`.
    b. `fal.ai` confirme le démarrage et retourne un `request_id`.
    c. Le service crée l'enregistrement **`Avatar`** dans la base de données (via Prisma) avec `status: PENDING` et le `falRequestId`.
    d. Le service retourne le nouvel objet `Avatar` au frontend.

**Étape 3 : Finalisation via Webhook**
1.  Quand `fal.ai` a terminé, il appelle notre endpoint `POST /api/webhooks/fal`.
2.  Le **Backend** (`webhooks/fal/services.ts`) :
    a. Trouve l'`Avatar` en BDD grâce au `falRequestId`.
    b. **Si succès :** télécharge la vidéo depuis l'URL `fal.ai`, l'uploade sur notre MinIO, et met à jour l'`Avatar` en BDD avec `status: SUCCEEDED` et le `videoStoragePath` final.
    c. **Si échec :** met à jour le `status` à `FAILED`.

**Étape 4 : Mise à Jour du Frontend**
1.  Pendant que le statut de l'avatar est `PENDING`, le **Frontend** peut interroger (poll) périodiquement une route `GET /api/avatars/{avatarId}` pour savoir si le statut a changé.
2.  Une fois que le statut passe à `SUCCEEDED`, le frontend affiche la vidéo finale.

---

## 4. Schéma de Base de Données Finalisé (v5)

Un avatar privé est lié à un utilisateur et à son projet de création. Les avatars publics n'ont pas de liens et sont filtrables par des tags.

```prisma
// Fichier : schema.prisma

enum AvatarType { PUBLIC, PRIVATE }
enum AvatarStatus { PENDING, SUCCEEDED, FAILED }
enum TagCategory { SEXE, AGE, INDUSTRIE }

model Avatar {
  id        String   @id @default(cuid())
  name      String
  type      AvatarType
  status    AvatarStatus

  // ID du job chez le fournisseur IA, pour le suivi via webhook.
  falRequestId String? @unique

  // Chemins finaux dans notre bucket MinIO "Better Ads".
  videoStoragePath String?
  imageStoragePath String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // --- Relations ---
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String?  // null pour les avatars publics

  project   Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String?  // null pour les avatars publics, représente le projet de création sinon

  tags      Tag[]      // Uniquement pour les avatars publics
}

model Tag {
  id        String      @id @default(cuid())
  name      String
  category  TagCategory
  avatars   Avatar[]
  @@unique([name, category])
}

// ... autres modèles (User, Project, etc.)
```

---

## 5. Structure de Stockage et Fichiers

**1. Structure du Bucket MinIO**

Le bucket (nommé `Better Ads`) sera structuré comme suit :

```
/public/avatars/{avatar_id}/
  - image.jpg
  - video.mp4
/private/{user_id}/avatars/{avatar_id}/
  - image.jpg
  - video.mp4
```

**2. Structure des Fichiers du Projet (Conforme à `rules.md`)**

```
/src/app/
  ├── api/
  │   ├── avatars/
  │   │   ├── route.ts
  │   │   ├── services.ts
  │   │   └── types.ts
  │   ├── uploads/ (...)
  │   └── webhooks/fal/ (...)
  └── _shared/
      ├── database/queries/avatar.ts
      ├── lib/
      │   ├── falAi.ts
      │   └── minio.ts
      └── types/common.ts
```

---

## 6. Checklist d'Implémentation (Backend)

Cette checklist est notre feuille de route pour le développement. Chaque phase vise à remplacer une partie des données "mockées" (fictives) du frontend par une vraie logique backend.

**Contexte Général :**
- **Le Frontend est prêt :** Tous les composants nécessaires (boutons, modales, affichages) existent déjà. Le travail consiste à les connecter aux nouvelles routes d'API.
- **Objectif :** Remplacer progressivement les données mockées par des appels à notre backend fonctionnel.

--- 

### Phase 0 : Pré-requis et Configuration

- [ ] **Base de Données :** Appliquer le schéma Prisma final à la base de données (`npx prisma db push`).
- [ ] **Configuration :** Remplir le fichier `.env.local` avec toutes les variables listées dans ce plan.
- [ ] **Test de Connexion MinIO :**
    - [ ] Créer un script de test simple (ex: `scripts/test-minio.ts`).
    - [ ] Ce script doit utiliser le `MinioService` pour tenter d'uploader un petit fichier de test, puis le supprimer.
    - [ ] **Objectif :** Valider à 100% que la configuration et les accès à MinIO sont corrects avant de continuer.

--- 

### Phase 1 : Remplacement du Mock - Génération d'Images (text-to-image)

*Le but est de permettre à l'utilisateur de générer une image à partir d'un texte.* 

- [ ] **Backend :**
    - [ ] Implémenter la méthode `generateImageFromText` dans `_shared/lib/falAi.ts`.
    - [ ] Créer une nouvelle route d'API `POST /api/image-generation/text-to-image` qui appelle cette méthode.
- [ ] **Frontend :**
    - [ ] Identifier le composant de génération d'image.
    - [ ] Remplacer l'appel aux données mockées par un appel à la nouvelle route d'API.
- [ ] **Objectif Atteint :** Un utilisateur tape un prompt et voit s'afficher une image réellement générée par `fal.ai`.

--- 

### Phase 2 : Remplacement du Mock - Modification d'Images (image-to-image)

*Le but est de permettre à l'utilisateur de modifier une image (générée ou uploadée) avec un prompt.*

- [ ] **Backend :**
    - [ ] Implémenter la méthode `modifyImage` dans `_shared/lib/falAi.ts`.
    - [ ] Créer une nouvelle route d'API `POST /api/image-generation/image-to-image`.
- [ ] **Frontend :**
    - [ ] Identifier les composants d'upload et de modification d'image.
    - [ ] Les connecter à la nouvelle route d'API.
- [ ] **Objectif Atteint :** Un utilisateur peut uploader ou sélectionner une image, et la modifier via un prompt.

--- 

### Phase 3 : Implémentation du Workflow Avatar (Génération et Stockage)

*Le but est d'implémenter le flux complet de création d'un avatar privé, de la sélection de l'image finale jusqu'au stockage.*

- [ ] **Backend - Upload de l'image de référence :**
    - [ ] Implémenter le `MinioService` (`_shared/lib/minio.ts`).
    - [ ] Implémenter la route `POST /api/uploads` qui retourne une URL d'upload sécurisée.
- [ ] **Backend - Lancement et suivi :**
    - [ ] Implémenter la méthode `generateVideoFromImage` dans `falAi.ts`.
    - [ ] Implémenter le service `avatars/services.ts` et la route `POST /api/avatars`.
    - [ ] Implémenter le service de webhook `webhooks/fal/services.ts` et sa route.
    - [ ] Implémenter la route `GET /api/avatars/{avatarId}` pour le polling.
- [ ] **Frontend :**
    - [ ] Connecter le bouton "Générer l'avatar" pour qu'il utilise ce nouveau workflow complet (upload de l'image de référence, puis appel à la création d'avatar).
- [ ] **Objectif Atteint :** Le processus complet de création d'avatar est fonctionnel. La base de données est mise à jour correctement et les fichiers sont stockés dans MinIO.