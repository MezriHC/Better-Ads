# 🎯 PLAN D'IMPLÉMENTATION API - Better Ads

## 📋 Vue d'ensemble du système

**Application** : Génération d'avatars vidéos + B-rolls
**Technologies** : Next.js, Prisma, PostgreSQL, MinIO, Fal.ai
**Bucket MinIO** : `better-ads`
**Documentation Fal.ai** : Voir `/docs/` pour tous les modèles et paramètres

### ⚠️ SCOPE ACTUEL - PHASE 1 :
1. **AVATARS UNIQUEMENT** (privés/publics) - Génération image → vidéo
2. **B-rolls** (text-to-video OU image-to-video)

### 🚫 NON INCLUS DANS CETTE PHASE :
- ❌ **TTS (Text-to-Speech)**  
- ❌ **Lip Sync / Talking Videos**
- ❌ **Audio/Voix quelconque**
- ✅ **Focus** : Création d'avatars vidéos muets uniquement

---

## 🗂️ STRUCTURE MINÍO FINALE

```
better-ads/
├── images/
│   ├── temp-generated/{userId}/{sessionId}/  # Images générées temporaires
│   ├── avatars/{userId}/                     # Images finales pour avatars privés
│   └── public-avatars/                       # Images avatars publics
├── videos/
│   ├── avatars/
│   │   ├── private/{userId}/                 # Vidéos avatars privés (MUETS)
│   │   └── public/                           # Vidéos avatars publics (MUETS)
│   └── b-rolls/{userId}/{projectId}/         # Vidéos B-rolls
```

**RÈGLES** : 
- Images temporaires → supprimées après génération vidéo avatar
- Avatars = vidéos MUETS uniquement (pas de lip sync dans cette phase)
- Utilisation modèles docs/ : **Seedance** (image-to-video) + **FLUX** (text/image-to-image)

---

## 🗃️ SCHEMA PRISMA COMPLET

```prisma
// ===== AUTHENTIFICATION (EXISTANT) =====
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts Account[]
  sessions Session[]
  projects Project[]
  avatars  Avatar[]
  b_rolls  BRoll[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ===== SYSTÈME DE TAGS =====
model TagCategory {
  id    String @id @default(cuid())
  name  String @unique  // "sexe", "age", "industrie"
  slug  String @unique  // "sexe", "age", "industrie"
  
  tags Tag[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Tag {
  id         String      @id @default(cuid())
  name       String      // "homme", "femme", "jeune", "médical", etc.
  slug       String      @unique
  categoryId String
  
  category TagCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  avatars  Avatar[]    @relation("AvatarTags")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([categoryId, slug])
}

// ===== PROJETS =====
model Project {
  id        String   @id @default(cuid())
  name      String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  avatars      Avatar[]
  b_rolls      BRoll[]
  
  @@index([userId])
}

// ===== AVATARS =====
model Avatar {
  id          String   @id @default(cuid())
  name        String
  imageUrl    String   // URL image utilisée pour créer l'avatar
  videoUrl    String   // URL vidéo avatar générée
  visibility  String   // "public" | "private"
  status      String   // "processing" | "ready" | "failed"
  userId      String?  // null pour avatars publics
  projectId   String?  // null pour avatars publics
  
  // Métadonnées Fal.ai
  falImageJobId String? // Job ID génération image
  falVideoJobId String? // Job ID génération vidéo
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tags    Tag[]    @relation("AvatarTags")
  
  @@index([userId])
  @@index([projectId])
  @@index([visibility, status])
}

// ===== TALKING VIDEOS (AJOUTÉ PLUS TARD - PHASE 2) =====
// model Video {
//   DÉSACTIVÉ - Implémentation future avec TTS/Lip sync
//   Cette table sera ajoutée lors de la phase 2
// }

// ===== B-ROLLS =====
model BRoll {
  id           String @id @default(cuid())
  name         String
  prompt       String @db.Text  // Texte pour génération
  imageUrl     String?          // Image source (si image-to-video)
  videoUrl     String
  thumbnailUrl String?
  status       String           // "processing" | "ready" | "failed"
  type         String           // "text-to-video" | "image-to-video"
  
  // Relations
  userId    String
  projectId String
  
  // Métadonnées Fal.ai
  falJobId String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([projectId])
  @@index([type, status])
}
```

---

## 🚀 PLAN D'IMPLÉMENTATION PAR PHASES

### **PHASE 1 : FOUNDATION** 
*Durée estimée : 2-3 jours*

#### **1.1 Setup Base de données**
- ✅ Créer migration Prisma avec nouveau schema
- ✅ Seed initial : TagCategories + Tags de base
- ✅ Test connexion DB

#### **1.2 Configuration MinIO**  
- ✅ Créer bucket `better-ads`
- ✅ Configurer structure dossiers
- ✅ Service upload/delete fichiers

#### **1.3 Services Core**
- ✅ `_shared/core/file-storage.service.ts` (MinIO)
- ✅ `_shared/core/fal-ai.service.ts` (client Fal.ai)
- ✅ Middleware auth routes API

---

### **PHASE 2 : GESTION TAGS & AVATARS PUBLICS**
*Durée estimée : 3-4 jours*

#### **2.1 API Tags**
```
GET  /api/tags                    # Tous tags groupés par catégorie
GET  /api/tags/[categorySlug]     # Tags d'une catégorie
POST /api/tags                    # Créer tag (admin)
```

#### **2.2 API Avatars Publics**
```
GET  /api/avatars/public          # Liste avatars publics + filtrage tags
GET  /api/avatars/public/[id]     # Détail avatar public
POST /api/avatars/public          # Créer avatar public (admin)
PUT  /api/avatars/public/[id]     # Modifier avatar public (admin)  
```

#### **2.3 Filtrage avancé**
- ✅ Query params : `?sexe=homme&age=jeune&industrie=medical`
- ✅ Combinaisons de tags multiples
- ✅ Pagination + tri

---

### **PHASE 3 : GESTION AVATARS PRIVÉS**
*Durée estimée : 4-5 jours*

#### **3.1 Génération d'images temporaires**
```
POST /api/images/generate         # Générer image avec FLUX (docs/flux-text-to-image.md)
POST /api/images/modify           # Modifier image avec FLUX (docs/flux-image-to-image.md)
GET  /api/images/temp/[sessionId] # Récupérer images session
DELETE /api/images/temp/[sessionId] # Nettoyer session
```

#### **3.2 API Avatars Privés**  
```
GET  /api/avatars/private         # Mes avatars privés (tous projets)
POST /api/avatars/private         # Créer avatar privé (image → vidéo MUET)
GET  /api/avatars/private/[id]    # Détail avatar privé
DELETE /api/avatars/private/[id]  # Supprimer avatar privé
```

#### **3.3 Pipeline Création Avatar**
- ✅ Upload/génération image → FLUX (docs/flux-*.md)
- ✅ Sélection image finale → **Seedance** (docs/seedance-image-to-video.md)
- ✅ Avatar = **vidéo MUETTE** (pas de lip sync)
- ✅ Gestion états (processing → ready/failed)
- ✅ Cleanup images temporaires

---

### **PHASE 4 : B-ROLLS**
*Durée estimée : 3-4 jours*

#### **4.1 API B-Rolls**
```
GET  /api/b-rolls                    # Mes b-rolls
POST /api/b-rolls                    # Créer b-roll 
GET  /api/b-rolls/[id]               # Détail b-roll  
DELETE /api/b-rolls/[id]             # Supprimer b-roll
GET  /api/projects/[id]/b-rolls      # B-rolls du projet
```

#### **4.2 Génération B-Rolls**
- ✅ **Text-to-Video** → Seedance text-to-video (docs/seedance-text-to-video.md)
- ✅ **Image-to-Video** → Seedance image-to-video (docs/seedance-image-to-video.md)
- ✅ Logique conditionnelle selon présence image
- ✅ Thumbnails automatiques

---

### **PHASE 5 : OPTIMISATIONS & MONITORING**
*Durée estimée : 2-3 jours*

#### **5.1 Performance**
- ✅ Cache Redis pour avatars publics
- ✅ Optimisation requêtes DB
- ✅ Compression images/vidéos

#### **5.2 Monitoring**  
- ✅ Logs jobs Fal.ai
- ✅ Métriques usage/coûts
- ✅ Alertes échecs génération

---

## 📝 ENDPOINTS DÉTAILLÉS

### **Authentication & Projects** (existant)
```
✅ POST /api/auth/[...nextauth]
✅ GET  /api/projects
✅ POST /api/projects  
✅ GET  /api/projects/[id]
```

### **Tags System**
```
GET /api/tags
└─ Query: ?category=sexe|age|industrie
└─ Response: { categories: [{ name, slug, tags: [...] }] }

POST /api/tags (admin only)
└─ Body: { name, categorySlug }
```

### **Avatars Management**
```
GET /api/avatars/public
└─ Query: ?sexe=homme&age=jeune&industrie=medical&page=1&limit=10
└─ Response: { avatars: [...], total, hasMore }

GET /api/avatars/private  
└─ Response: { avatars: [...] } // Tous mes avatars privés

POST /api/avatars/private
└─ Body: { name, imageUrl, projectId }
└─ Process: imageUrl → Fal.ai → videoUrl → DB
```

### **Content Generation**
```
POST /api/images/generate
└─ Body: { prompt, userId, sessionId }
└─ Response: { imageUrl, jobId }
└─ Modèle: FLUX text-to-image (docs/flux-text-to-image.md)

POST /api/images/modify  
└─ Body: { imageUrl, modifications, sessionId }
└─ Response: { imageUrl, jobId }
└─ Modèle: FLUX image-to-image (docs/flux-image-to-image.md)

POST /api/avatars/private
└─ Body: { name, imageUrl, projectId }
└─ Process: Image → Seedance → Vidéo Avatar MUET
└─ Modèle: Seedance image-to-video (docs/seedance-image-to-video.md)

POST /api/b-rolls
└─ Body: { name, prompt, imageUrl?, projectId }  
└─ Process: Text/Image → Seedance → Video → Thumbnail
└─ Modèles: Seedance text/image-to-video (docs/seedance-*.md)
```

---

## 🔧 SERVICES TECHNIQUES À CRÉER

### **1. File Storage Service**
```typescript
// _shared/core/file-storage.service.ts
class FileStorageService {
  uploadFile(buffer: Buffer, path: string): Promise<string>
  deleteFile(path: string): Promise<void>
  getPresignedUrl(path: string): Promise<string>
  deleteDirectory(path: string): Promise<void>
  moveFile(fromPath: string, toPath: string): Promise<void>
}
```

### **2. Fal.ai Service**  
```typescript
// _shared/core/fal-ai.service.ts
// Documentation complète dans /docs/
class FalAiService {
  // FLUX Models (docs/flux-*.md)
  generateImage(prompt: string): Promise<{ imageUrl: string, jobId: string }>
  modifyImage(imageUrl: string, prompt: string): Promise<{ imageUrl: string, jobId: string }>
  
  // Seedance Models (docs/seedance-*.md)
  imageToVideo(imageUrl: string, prompt?: string): Promise<{ videoUrl: string, jobId: string }>
  textToVideo(prompt: string): Promise<{ videoUrl: string, jobId: string }>
  
  // Gestion jobs
  getJobStatus(jobId: string): Promise<JobStatus>
  
  // ❌ PAS DANS CETTE PHASE
  // lipSync(videoUrl: string, audioUrl: string): Promise<...>
}
```

### **3. Avatar Service**
```typescript  
// _shared/core/avatar.service.ts
class AvatarService {
  createPrivateAvatar(data: CreateAvatarData): Promise<Avatar>
  filterPublicAvatars(filters: TagFilters): Promise<Avatar[]>
  getUserAvatars(userId: string): Promise<Avatar[]>
  deleteAvatar(avatarId: string, userId: string): Promise<void>
}
```

### **4. Content Generation Service**
```typescript
// _shared/core/content-generation.service.ts
class ContentGenerationService {
  // AVATARS MUETS (pas de lip sync dans cette phase)
  generateMuteAvatar(imageUrl: string, name: string): Promise<Avatar>
  
  // B-ROLLS
  generateBRoll(prompt: string, imageUrl?: string): Promise<BRoll>  
  
  // UTILITY
  cleanupTempImages(sessionId: string): Promise<void>
  getGenerationStatus(jobId: string): Promise<JobStatus>
  
  // ❌ PAS DANS CETTE PHASE
  // generateTalkingVideo(avatarId: string, script: string, voiceId: string): Promise<Video>
}
```

---

## ✅ VALIDATION CHECKLIST

### **Avant chaque endpoint :**
- [ ] Schema Zod validation
- [ ] Authentification requise  
- [ ] Permissions utilisateur
- [ ] Gestion erreurs complète
- [ ] Types TypeScript  

### **Avant chaque intégration Fal.ai :**
- [ ] **Consulter docs/** avant implémentation modèle
- [ ] Test modèle en isolation avec paramètres docs/
- [ ] Gestion jobs asynchrones
- [ ] Retry en cas d'échec
- [ ] Monitoring coûts

### **Avant mise en production :**
- [ ] Tests E2E complets
- [ ] Performance DB optimisée  
- [ ] Sécurité fichiers validée
- [ ] Monitoring en place

---

## 🎯 PRÊT POUR L'IMPLÉMENTATION

Ce plan couvre 100% des besoins **AVATARS MUETS + B-ROLLS** sans ambiguïté. Chaque phase est indépendante et peut être testée isolément.

**⚠️ POINTS FLOUS ÉLIMINÉS :**
- ✅ **Scope clarifié** : Avatars muets uniquement (pas de TTS/lip sync)
- ✅ **Modèles Fal.ai** : Documentation complète dans `/docs/`
- ✅ **Structure MinIO** : Séparation claire public/privé
- ✅ **États simplifiés** : processing/ready/failed uniquement
- ✅ **Réutilisation avatars** : Cross-project confirmée

**ORDRE D'EXÉCUTION :**
1. **PHASE 1** (Foundation) 
2. **PHASE 2** (Tags + Avatars publics)
3. **PHASE 3** (Avatars privés - FLUX + Seedance)  
4. **PHASE 4** (B-rolls - Seedance text/image-to-video)
5. **PHASE 5** (Optimisations)

**🚫 PHASE 2 FUTURE** : TTS + Lip Sync (non incluse dans ce plan)

**Prêt à démarrer la Phase 1 ?** 🚀