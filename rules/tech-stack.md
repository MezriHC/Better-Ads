# 🚀 Tech Stack

Stack technique utilisée dans ce projet.

## 🏗️ **Framework**

### **Next.js 15.3.3**
- Framework React full-stack
- App Router 
- Server & Client Components
- API Routes

### **React 19.0.0**
- Librairie frontend
- Hooks personnalisés
- Context API

## 🎨 **Styling**

### **Tailwind CSS 4.0**
- Framework CSS utility-first
- Design responsive
- Support thème sombre

## 🗄️ **Base de Données**

### **Prisma 6.9.0**
- ORM TypeScript moderne
- Client type-safe
- Migrations automatiques

### **PostgreSQL**
- Base de données relationnelle
- Conteneurisée avec Docker
- Interface pgAdmin

### **Docker**
- Conteneurisation PostgreSQL
- Configuration docker-compose
- Environnement isolé

## 🔐 **Authentification**

### **NextAuth.js v5 (auth.js)**
- Authentification Google OAuth 2.0
- Sessions en base de données (stratégie "database")
- Adapter Prisma intégré
- Middleware pour la protection des routes
- Pages de connexion personnalisées

## 🌙 **Thèmes**

### **next-themes 0.4.6**
- Gestion thème clair/sombre
- Détection système
- Sans problème d'hydratation

## 📝 **TypeScript**

### **TypeScript 5.x**
- Typage complet
- Configuration stricte
- Path mapping (`@/*`)

## 🧩 **Utilitaires**

- **Lucide React 0.514.0** - Icônes
- **@tabler/icons-react** - Icônes
- **clsx 2.1.1** - Classes conditionnelles  

## 🛠️ **Outils de Développement**

### **Scripts NPM**
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run db:start` - Démarre PostgreSQL (Docker)
- `npm run db:stop` - Arrête PostgreSQL
- `npm run db:studio` - Interface Prisma Studio
- `npm run db:push` - Synchronise schéma DB
- `npm run db:generate` - Génère client Prisma
