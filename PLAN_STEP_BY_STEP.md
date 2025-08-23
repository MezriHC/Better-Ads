# 🎯 PLAN DÉTAILLÉ ÉTAPE PAR ÉTAPE - Better Ads

## 📋 PRINCIPE : Validation à chaque étape

**RÈGLE ABSOLUE** : Ne passer à l'étape suivante QUE si l'étape précédente fonctionne à 100%.

---

## 🔧 ÉTAPE 1 : VALIDATION ACCÈS & CONFIGURATION

### **1.1 Variables d'environnement** 
❓ **Questions pour toi :**
- As-tu toutes les variables `.env` configurées ?
- Fal.ai API Key ?
- MinIO credentials ?
- Database URL PostgreSQL ?

✅ **Validations :**
- [ ] Connexion DB PostgreSQL réussie
- [ ] Test API Fal.ai (simple ping)
- [ ] Connexion MinIO réussie

### **1.2 Création bucket MinIO**
❓ **Questions pour toi :**
- Le bucket `better-ads` existe-t-il ?
- As-tu les permissions lecture/écriture ?

✅ **Actions & Validations :**
- [ ] Créer bucket `better-ads` 
- [ ] Test upload fichier simple
- [ ] Test suppression fichier
- [ ] Créer structure dossiers :
  ```
  better-ads/
  ├── images/temp-generated/
  ├── images/avatars/
  ├── images/public-avatars/
  ├── videos/avatars/private/
  ├── videos/avatars/public/
  └── videos/b-rolls/
  ```

**🛑 STOP** : Valider que MinIO fonctionne à 100% avant d'avancer

---

## 🗃️ ÉTAPE 2 : MIGRATION BASE DE DONNÉES

### **2.1 Schema Prisma**
✅ **Actions & Validations :**
- [ ] Mettre à jour `schema.prisma` avec nouveau modèle
- [ ] Générer migration : `prisma migrate dev --name "add-avatars-system"`
- [ ] Vérifier tables créées en DB
- [ ] Test requête simple sur chaque table

### **2.2 Seed des tags**
✅ **Actions & Validations :**
- [ ] Créer script seed avec tags de base :
  - **Sexe** : homme, femme
  - **Âge** : jeune, adulte, senior  
  - **Industrie** : médical, business, sport, tech
- [ ] Exécuter seed : `prisma db seed`
- [ ] Vérifier tags en DB

**🛑 STOP** : Valider que la DB est prête à 100% avant d'avancer

---

## 🔌 ÉTAPE 3 : SERVICES CORE

### **3.1 Service MinIO**
✅ **Actions & Validations :**
- [ ] Créer `_shared/core/file-storage.service.ts`
- [ ] Test upload image
- [ ] Test suppression image
- [ ] Test génération URL présignée

### **3.2 Service Fal.ai de base** 
✅ **Actions & Validations :**
- [ ] Créer `_shared/core/fal-ai.service.ts`
- [ ] Test connexion API Fal.ai
- [ ] Test simple avec modèle FLUX text-to-image
- [ ] Valider réponse API conforme à `docs/flux-text-to-image.md`

**🛑 STOP** : Valider services core à 100% avant d'avancer

---

## 🖼️ ÉTAPE 4 : GÉNÉRATION D'IMAGES

### **4.1 API Génération d'images**
✅ **Actions & Validations :**
- [ ] Créer `POST /api/images/generate`
- [ ] Input : `{ prompt, userId, sessionId }`  
- [ ] Utiliser FLUX text-to-image (`docs/flux-text-to-image.md`)
- [ ] Sauvegarder dans `images/temp-generated/{userId}/{sessionId}/`
- [ ] Output : `{ imageUrl, jobId, status }`

❓ **Test de validation :**
- Générer 1 image avec prompt simple
- Vérifier image dans MinIO
- Vérifier URL accessible

### **4.2 API Modification d'images**
✅ **Actions & Validations :**
- [ ] Créer `POST /api/images/modify`
- [ ] Input : `{ imageUrl, prompt, sessionId }`
- [ ] Utiliser FLUX image-to-image (`docs/flux-image-to-image.md`)
- [ ] Sauvegarder modification dans même session
- [ ] Output : `{ imageUrl, jobId, status }`

❓ **Test de validation :**
- Upload 1 image
- Modifier couleur cheveux par exemple  
- Vérifier nouvelle image générée
- Vérifier 2 images dans session

### **4.3 API Gestion sessions temporaires**
✅ **Actions & Validations :**
- [ ] Créer `GET /api/images/temp/[sessionId]`
- [ ] Lister toutes images de la session
- [ ] Créer `DELETE /api/images/temp/[sessionId]`
- [ ] Supprimer toutes images session

❓ **Test complet génération images :**
- [ ] Générer 3 images différentes dans même session
- [ ] Modifier 1 des images → 4 images total
- [ ] Lister images session → voir 4 images
- [ ] Supprimer session → 0 image

**🛑 STOP** : Valider système images temporaires à 100%

---

## 👤 ÉTAPE 5 : CRÉATION AVATARS PRIVÉS

### **5.1 API Tags**
✅ **Actions & Validations :**
- [ ] Créer `GET /api/tags`
- [ ] Retourner tags groupés par catégorie
- [ ] Test : récupérer tous tags et vérifier structure

### **5.2 API Avatars privés - Création**
✅ **Actions & Validations :**
- [ ] Créer `POST /api/avatars/private`
- [ ] Input : `{ name, imageUrl, projectId }`
- [ ] Déplacer image de temp vers `images/avatars/{userId}/`
- [ ] Utiliser Seedance image-to-video (`docs/seedance-image-to-video.md`)
- [ ] Créer Avatar en DB avec status "processing"
- [ ] Return immédiatement : `{ avatarId, status: "processing" }`

### **5.3 Pipeline asynchrone Avatar**
✅ **Actions & Validations :**
- [ ] Job asynchrone : Image → Seedance → Vidéo
- [ ] Sauvegarder vidéo dans `videos/avatars/private/{userId}/`
- [ ] Mettre à jour Avatar en DB : status "ready" + videoUrl
- [ ] Si échec : status "failed"

❓ **Test critique - Fermeture popup :**
- [ ] Lancer création avatar
- [ ] Fermer popup immédiatement  
- [ ] Vérifier Avatar en DB avec status "processing"
- [ ] Attendre fin génération (background)
- [ ] Rafraîchir page projet → voir avatar "ready"

### **5.4 API Avatars privés - Lecture**
✅ **Actions & Validations :**
- [ ] Créer `GET /api/avatars/private`
- [ ] Retourner TOUS avatars user (cross-project)
- [ ] Créer `GET /api/avatars/private/[id]`
- [ ] Créer `DELETE /api/avatars/private/[id]`

❓ **Test complet avatars privés :**
- [ ] Créer avatar dans Projet A
- [ ] Vérifier avatar visible depuis Projet B
- [ ] Supprimer avatar → plus visible nulle part
- [ ] Vérifier files supprimés de MinIO

**🛑 STOP** : Valider système avatars privés complet

---

## 🎥 ÉTAPE 6 : B-ROLLS

### **6.1 API B-Rolls - Text-to-Video**
✅ **Actions & Validations :**
- [ ] Créer `POST /api/b-rolls`
- [ ] Input : `{ name, prompt, projectId }` (sans imageUrl)
- [ ] Utiliser Seedance text-to-video (`docs/seedance-text-to-video.md`)
- [ ] Créer BRoll en DB : status "processing", type "text-to-video"

### **6.2 API B-Rolls - Image-to-Video**
✅ **Actions & Validations :**
- [ ] Même endpoint `POST /api/b-rolls`
- [ ] Input : `{ name, prompt, imageUrl, projectId }`
- [ ] Si imageUrl → Seedance image-to-video
- [ ] Créer BRoll en DB : status "processing", type "image-to-video"

### **6.3 Pipeline asynchrone B-Rolls**
✅ **Actions & Validations :**
- [ ] Job background selon type
- [ ] Sauvegarder dans `videos/b-rolls/{userId}/{projectId}/`
- [ ] Générer thumbnail automatique
- [ ] Update DB : status "ready" + videoUrl + thumbnailUrl

### **6.4 API B-Rolls - Gestion**
✅ **Actions & Validations :**
- [ ] Créer `GET /api/b-rolls` (mes b-rolls)
- [ ] Créer `GET /api/projects/[id]/b-rolls` (b-rolls du projet)
- [ ] Créer `DELETE /api/b-rolls/[id]`

❓ **Test complet B-Rolls :**
- [ ] Créer B-Roll text-to-video
- [ ] Créer B-Roll image-to-video  
- [ ] Vérifier génération background
- [ ] Vérifier thumbnails créés
- [ ] Filtrer par projet

**🛑 STOP** : Valider système B-Rolls complet

---

## 🔍 ÉTAPE 7 : AVATARS PUBLICS

### **7.1 API Avatars publics - Lecture**
✅ **Actions & Validations :**
- [ ] Créer `GET /api/avatars/public`
- [ ] Support filtrage : `?sexe=homme&age=jeune&industrie=medical`
- [ ] Pagination + tri
- [ ] Créer `GET /api/avatars/public/[id]`

### **7.2 API Avatars publics - Admin (optionnel)**
✅ **Actions & Validations :**
- [ ] Créer `POST /api/avatars/public` (admin)
- [ ] Sauvegarder dans `videos/avatars/public/`
- [ ] Associer tags lors de la création

❓ **Test filtrage avatars publics :**
- [ ] Créer 5 avatars publics avec tags différents
- [ ] Test filtrage par sexe uniquement
- [ ] Test filtrage combiné sexe + âge
- [ ] Test filtrage sur industrie
- [ ] Vérifier pagination

**🛑 STOP** : Valider système avatars publics complet

---

## ✅ PLAN DE VALIDATION FINAL

### **Tests d'intégration complets :**
1. **Workflow Avatar Privé :**
   - Générer images → Modifier → Créer avatar → Fermer popup → Vérifier background
   
2. **Workflow B-Roll :**
   - Text-to-video + Image-to-video dans même projet
   
3. **Workflow Cross-Project :**
   - Avatar créé Projet A → Visible Projet B → Réutilisable

4. **Workflow Cleanup :**
   - Suppression avatar → Files MinIO supprimés
   - Suppression session → Images temp supprimées

### **Performance :**
- [ ] Time génération avatar < 2min
- [ ] Time génération B-Roll < 1min  
- [ ] API responses < 500ms
- [ ] Upload images < 10s

---

## 🎯 RÉSUMÉ ÉTAPES

1. **ACCÈS** → Valider env + MinIO + DB
2. **DB** → Migrer + Seed tags
3. **SERVICES** → MinIO + Fal.ai de base
4. **IMAGES** → Génération + Modification + Sessions  
5. **AVATARS** → Privés + Background jobs
6. **B-ROLLS** → Text/Image-to-video
7. **PUBLICS** → Avatars publics + Filtrage

**Chaque étape = validation 100% avant la suivante !**

**On commence par l'ÉTAPE 1 ?** 🚀