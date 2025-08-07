#!/bin/sh

# Script de démarrage pour Better Ads
# Gère Prisma et démarre Next.js

echo "🚀 Démarrage de Better Ads..."

# Vérifier si les variables d'environnement critiques sont définies
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL non définie, utilisation de la base par défaut"
fi

if [ -z "$BETTER_AUTH_SECRET" ]; then
    echo "⚠️  BETTER_AUTH_SECRET non définie, utilisation du secret par défaut"
fi

# Appliquer les migrations Prisma si nécessaire
echo "📊 Application des migrations Prisma..."
npx prisma migrate deploy 2>/dev/null || echo "⚠️  Migrations Prisma ignorées (normal si pas de BDD)"

# Générer le client Prisma (au cas où)
echo "🔧 Génération du client Prisma..."
npx prisma generate

echo "✅ Configuration terminée, démarrage de l'application..."

# Démarrer Next.js
exec node server.js