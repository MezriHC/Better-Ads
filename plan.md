Voici la structure complète du système, y compris la gestion des **avatars**, **tags**, **filtrage**, et la structure des **buckets MinIO**. Tu peux le transmettre à ton développeur pour qu’il ait toutes les informations nécessaires pour implémenter le système sans manquer de détails.

---

# Documentation Technique : Gestion des Avatars et Vidéos Générées

## 1. **Objectif du système**

Le système permet à un utilisateur de :

* Créer des **avatars privés** à partir d'images et vidéos générées par l'utilisateur lui-même.
* Utiliser des **avatars publics** (préexistants) pour générer des vidéos avec un script et un moteur de synthèse vocale (TTS).
* Lier **avatars** et **vidéos générées** à des **projets** spécifiques pour chaque utilisateur.
* **Filtrer** les avatars publics en fonction de **tags** associés (genre, âge, thème).

## 2. **Structure des Buckets MinIO**

Nous avons un seul bucket de stockage **MinIO**, avec des préfixes organisés par type d'élément (avatars publics, avatars privés, vidéos générées). Voici la structure complète :

```
mini-prod-media/
│
├── avatars/
│   ├── public/             # TOUS les avatars publics (tags gérés en base)
│   └── private/{userId}/   # Avatars privés associés à chaque utilisateur
│
├── videos/
│   └── generated/{userId}/{projectId}/  # Vidéos générées par l'utilisateur, organisées par projet
```

### Accès aux fichiers

Les **avatars publics** et **vidéos générées** sont accessibles par tous les utilisateurs. Les **avatars privés** sont uniquement accessibles par leur propriétaire via un contrôle d'accès sur les **URLs présignées** (en utilisant l'authentification utilisateur).

---

## 3. **Schéma de la Base de Données (Prisma)**

### 3.1 **Tables principales**

#### **Table `TagCategory`** : Catégories de tags (par exemple, âge, genre, thème)

```prisma
model TagCategory {
  id    String  @id @default(cuid())  // Identifiant unique de la catégorie de tag
  label String  // Libellé de la catégorie (par exemple, "âge", "genre", "thème")
  slug  String  @unique // Version "slug" du tag pour l'indexation

  tags   Tag[]   @relation("CategoryTags") // Relation avec les tags associés à cette catégorie
}
```

#### **Table `Tag`** : Les tags spécifiques (ex. "homme", "jeune adulte", "médical")

```prisma
model Tag {
  id             String        @id @default(cuid())  // Identifiant unique du tag
  label          String        // Libellé du tag (ex. "jeune adulte", "homme", "médical")
  slug           String        @unique // Version "slug" pour l'indexation
  categoryId     String        // ID de la catégorie de tag (âge, genre, thème)
  category       TagCategory   @relation(fields: [categoryId], references: [id])

  avatars        Avatar[]      @relation("AvatarTags") // Relation avec les avatars associés à ce tag
}
```

#### **Table `Avatar`** : Stockage des avatars (publics et privés)

```prisma
model Avatar {
  id          String    @id @default(cuid()) // Identifiant unique de l'avatar
  title       String    // Nom de l'avatar
  videoUrl    String    // URL du fichier vidéo de l'avatar (MinIO)
  posterUrl   String    // URL de l'image miniature ou poster de l'avatar
  visibility  String    // 'public' ou 'private' (ici on gère les avatars publics pour les tags)
  userId      String?   // L'ID de l'utilisateur (pour avatars privés)
  projectId   String?   // L'ID du projet auquel cet avatar est lié (uniquement pour les avatars privés)
  createdAt   DateTime  @default(now()) // Date de création
  updatedAt   DateTime  @updatedAt // Date de mise à jour
  status      String    // Statut de l'avatar : 'ready', 'processing', 'failed'
  metadata    Json?     // Métadonnées (tags, catégorie, etc.)

  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project     Project?  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tags        Tag[]     @relation("AvatarTags")  // Relation avec les tags (âge, genre, thème)

  @@index([userId])  // Pour les avatars privés
  @@index([projectId])  // Pour les avatars liés à un projet privé
}
```

**Note :** La relation many-to-many entre `Avatar` et `Tag` est gérée automatiquement par Prisma via `@relation("AvatarTags")`. Aucune table intermédiaire manuelle n'est nécessaire.

#### **Table `Project`** : Liée à un utilisateur, elle contient les avatars et vidéos générées

```prisma
model Project {
  id        String   @id @default(cuid())
  name      String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  avatars   Avatar[]
  videos    Video[]

  @@index([userId])
}
```

#### **Table `Video`** : Vidéos générées par l'utilisateur, basées sur un avatar ou un moteur IA

```prisma
model Video {
  id            String   @id @default(cuid()) // Identifiant unique de la vidéo
  userId        String   // L'utilisateur qui a généré la vidéo
  avatarId      String?  // Optionnel si la vidéo utilise un avatar
  videoUrl      String   // URL de la vidéo générée
  thumbnailUrl  String   // URL de la miniature
  status        String   // Statut : 'queued', 'processing', 'ready', 'failed'
  scriptText    String   // Texte du script utilisé pour générer la vidéo
  ttsVoiceId    String   // Identifiant du TTS utilisé (si applicable)
  projectId     String   // L'ID du projet auquel cette vidéo est liée
  createdAt     DateTime @default(now()) // Date de création
  updatedAt     DateTime @updatedAt // Date de mise à jour
  avatar        Avatar?  @relation(fields: [avatarId], references: [id])
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([projectId])
}
```

---

## 4. **Filtrage des Avatars Publics par Tags**

Les avatars publics peuvent être filtrés selon **plusieurs tags** à la fois : un tag d'**âge**, un tag de **genre** et un tag de **thème**. Voici un exemple de requête Prisma pour filtrer les avatars publics :

```javascript
// Exemple 1: Filtrage OR (avatar avec AU MOINS un des tags)
const avatarsOr = await prisma.avatar.findMany({
  where: {
    visibility: "public",
    tags: {
      some: {
        label: { in: ["homme", "jeune-adulte", "sport"] }
      }
    }
  },
  include: { tags: { include: { category: true } } }
});

// Exemple 2: Filtrage AND (avatar avec TOUS les tags demandés)
const avatarsAnd = await prisma.avatar.findMany({
  where: {
    visibility: "public",
    AND: [
      { tags: { some: { label: "homme" } } },
      { tags: { some: { label: "jeune-adulte" } } },
      { tags: { some: { label: "sport" } } }
    ]
  },
  include: { tags: { include: { category: true } } }
});
```

---

## 5. **Détails d'implémentation à considérer**

1. **Gestion des tags** :

   * Un **avatar public** peut avoir jusqu'à **3 tags** : un pour **l'âge**, un pour **le genre**, et un pour **le thème**.
   * Ces tags sont organisés en **catégories** : **âge**, **genre**, **thème**.

2. **Relation entre les avatars et les tags** :

   * Chaque avatar peut avoir **plusieurs tags**, mais chaque tag est associé à une **seule catégorie**.
   * Les avatars peuvent être filtrés par une **combinaison de tags** (ex : "homme", "jeune adulte", "sport").

3. **URL des fichiers** :

   * Les fichiers dans **MinIO** sont stockés dans des répertoires simples (`public/`, `private/{userId}/`, `generated/{userId}/{projectId}/`).
   * Les **tags sont gérés uniquement en base de données** pour plus de flexibilité et de performance.
   * L'accès aux fichiers est contrôlé par l'**authentification de l'utilisateur** (URLs présignées pour les fichiers privés).

---

### Conclusion

Cette documentation fournit une structure détaillée de la gestion des avatars, des vidéos et des tags, ainsi que la manière de les organiser et de les filtrer pour les utilisateurs. Avec cette base, ton développeur pourra implémenter le système complet en s’assurant que toutes les relations, accès et filtrages sont bien gérés.

---

Tu peux maintenant transmettre ce fichier `.md` à ton développeur pour qu'il ait toutes les informations nécessaires !
