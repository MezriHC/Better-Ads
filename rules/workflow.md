# 🚀 Better Ads - Référence Projet

> **📖 Guide de référence** pour comprendre le projet Better Ads : stack technique, workflow de développement, et architecture déploiement.

## 🏗️ Stack Technique

### **Technologies Utilisées**
- **Next.js 15.4.5** - Framework React full-stack + TypeScript
- **NextAuth.js 4.24.11** - Authentification
- **PostgreSQL 16** - Base de données principale
- **Prisma 6.13.0** - ORM avec migrations automatiques
- **Tailwind CSS 4.0** - Styling et design system
- **MinIO** - Storage S3-compatible

### **Philosophie de Développement**
- **Stack simple et maîtrisé** : Pas de dépendances complexes
- **PostgreSQL + NextAuth** : Base solide pour l'authentification
- **Migration automatique** : Prisma gère les changements de schéma
- **Docker local** : Services isolés pour le développement
- **Coolify production** : Déploiement simplifié

### **Architecture Environnements**
- **Local** : Docker Compose (MinIO seul) + PostgreSQL distant + `npm run dev`
- **Production** : 3 services Coolify séparés (App + PostgreSQL + MinIO)

---

## 🔄 Workflow de Développement

### **Principe : Base de données partagée**
- **PostgreSQL** : Base de données hébergée sur le VPS (port 5432 exposé)
- **Développement** : Connexion directe à la base distante via IP publique
- **Collaboration** : Tous les développeurs partagent les mêmes données

### **1️⃣ Développement Local**
```bash
npm run docker:up      # Démarrer MinIO uniquement
npm run db:push        # Sync schéma → Base distante (prototypage rapide)
npm run dev            # Next.js avec hot reload + base distante
```

### **2️⃣ Prêt pour Production**
```bash
npm run db:migrate     # Créer migration officielle
git add .
git commit -m "feat: description"
git push origin main   # → Déploiement automatique
```

### **3️⃣ Production Automatique**
```bash
# Coolify détecte le push et :
# 1. Build le Dockerfile
# 2. Exécute `npx prisma migrate deploy`
# 3. Démarre Next.js si migrations OK
```
---

## 🚀 Architecture Production (Coolify)

### **Services Séparés (Recommandé)**
```
Service 1: Next.js App ────┐
                          │── Network interne Coolify
Service 2: PostgreSQL ────┤   (Communication sécurisée)
                          │
Service 3: MinIO ─────────┘
```

### **Avantages Architecture**
- ✅ **Scalabilité** : Chaque service indépendant
- ✅ **Backup** : Base de données isolée
- ✅ **Maintenance** : Mise à jour par service
- ✅ **Sécurité** : Network isolé

### **Déploiement Git → Production**
1. **Push sur main** → Coolify détecte
2. **Build Dockerfile** avec dépendances
3. **Migration automatique** : `npx prisma migrate deploy`
4. **Démarrage app** si tout OK
5. **Rollback automatique** si erreur

---

## 🛠️ Commandes de Développement

### **Scripts NPM Disponibles**
```bash
# Application
npm run dev              # Next.js développement (Turbopack)
npm run build            # Build production
npm run start            # Démarrer version build

# Services Docker (Local uniquement)
npm run docker:up        # MinIO uniquement (PostgreSQL distant)
npm run docker:down      # Arrêter services
npm run docker:reset     # Reset MinIO (données locales uniquement)

# Base de données (Prisma)
npm run db:push          # Sync direct schéma (développement)
npm run db:migrate       # Créer migration (avant prod)
npm run db:deploy        # Appliquer migrations (production)
npm run db:studio        # Interface graphique Prisma
npm run db:generate      # Régénérer client Prisma
```

### **Interfaces de Développement**
- **App** : http://localhost:3000
- **Prisma Studio** : http://localhost:5555 (`npm run db:studio`)
- **MinIO Console** : http://localhost:9001 (minioadmin/minioadmin123)

---

## 🌐 Base de Données Distante

### **Architecture Actuelle**
- **PostgreSQL** hébergé sur le VPS de production
- **Port 5432** exposé publiquement pour le développement
- **Données partagées** entre tous les développeurs
- **MinIO** reste en local pour le stockage de fichiers

### **Configuration VPS**
```bash
# Conteneur PostgreSQL exposé
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=... \
  postgres:17-alpine
```

### **Avantages**
- ✅ **Collaboration** : Données synchronisées entre développeurs
- ✅ **Simplicité** : Plus de Docker PostgreSQL local
- ✅ **Réalisme** : Développement sur environnement proche de la prod
- ✅ **Debugging** : Problèmes visibles par toute l'équipe

### **Sécurité**
- ⚠️ **Port exposé** : PostgreSQL accessible depuis internet
- ⚠️ **Données partagées** : Modifications visibles par tous
- ⚠️ **Backup essentiel** : Base unique pour tout le développement

---

## ⚙️ Configuration Environnements

### **Local vs Production**
- **Local** : `.env` avec localhost et Docker
- **Production** : Variables Coolify avec services internes

### **Variables Essentielles (Local)**
```env
NEXTAUTH_SECRET=          # Secret 64 chars pour NextAuth
NEXTAUTH_URL=             # http://localhost:3000
DATABASE_URL=             # PostgreSQL distant (VPS avec port 5432 exposé)
GOOGLE_CLIENT_ID=         # OAuth Google (dev)
GOOGLE_CLIENT_SECRET=     # OAuth Google (dev)
```

### **Variables Production (Coolify)**
- **NextAuth** : Nouveau secret + URL production
- **Database** : Connection string service PostgreSQL
- **Google OAuth** : Client/Secret production séparés
- **MinIO** : Endpoints et clés production