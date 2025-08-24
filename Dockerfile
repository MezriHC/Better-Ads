FROM node:20-slim AS base

# Installer les dépendances système pour Debian
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Copier le schéma Prisma AVANT npm ci (pour éviter l'erreur postinstall)
COPY prisma ./prisma/

# Nettoyer le cache npm et forcer la reconstruction des modules natifs
RUN npm cache clean --force

# Installer les dépendances avec rebuild des modules natifs
RUN npm ci --legacy-peer-deps --build-from-source

# Forcer la reconstruction de lightningcss pour l'architecture correcte
RUN npm rebuild lightningcss --build-from-source

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
