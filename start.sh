#!/bin/sh

# Script de démarrage pour Coolify avec Prisma
echo "🚀 Démarrage de Better Ads..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 5

# Synchroniser le schéma Prisma avec la base de données
echo "📊 Synchronisation du schéma Prisma..."
npx prisma db push --skip-generate

# Démarrer l'application
echo "✅ Démarrage de l'application..."
exec node server.js