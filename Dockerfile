FROM node:20-alpine AS base

# Installer les dépendances système
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Copier le schéma Prisma AVANT npm ci (pour éviter l'erreur postinstall)
COPY prisma ./prisma/

# Installer les dépendances et générer Prisma client
RUN npm ci

# Copier le code source
COPY . .

# Build de l'application Next.js
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production

# Script de démarrage avec migration automatique
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
