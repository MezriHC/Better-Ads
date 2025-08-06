#!/bin/sh

# Script de démarrage pour Coolify avec Prisma
echo "🚀 Démarrage de Better Ads..."

# Debug: Afficher les variables d'environnement Better Auth
echo "🔍 Variables Better Auth:"
echo "BETTER_AUTH_URL: $BETTER_AUTH_URL"
echo "NEXT_PUBLIC_BETTER_AUTH_URL: $NEXT_PUBLIC_BETTER_AUTH_URL"

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 5

# Synchroniser le schéma Prisma avec la base de données
echo "📊 Synchronisation du schéma Prisma..."
npx prisma db push --skip-generate

# Démarrer l'application
echo "✅ Démarrage de l'application..."
exec node server.js