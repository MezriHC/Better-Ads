# 📋 Plan de développement & workflow

## 1. Structure des branches Git
- **`dev`** : branche de développement, utilisée par tous les développeurs pour implémenter et tester les nouvelles fonctionnalités.
- **`main`** : branche de production, déployée automatiquement sur l’environnement de prod via **Coolify**.

**Workflow :**
1. Les développeurs travaillent sur des branches dérivées de `dev`.
2. Les PR sont mergées dans `dev` après validation.
3. Quand `dev` est stable, on merge dans `main` pour déclencher le déploiement en production.

---

## 2. Gestion des environnements
- **Environnement de développement (Coolify)**  
  - Base de données **Supabase - dev** (PostgreSQL + stockage S3).
  - Frontend déployé automatiquement depuis la branche `dev`.
  - Test de toutes les migrations et features.
  
- **Environnement de production (Coolify)**  
  - Base de données **Supabase - prod** totalement séparée.
  - Frontend déployé automatiquement depuis la branche `main`.
  - Accès restreint à la base prod (limité aux leads/ops).

---

## 3. Gestion de la base de données avec Prisma
- Les changements de schéma se font via **Prisma Migrate**.
- **Processus strict :**
  1. Écrire la migration (`prisma migrate dev`).
  2. Tester sur la base **dev**.
  3. Valider via code review.
  4. Appliquer en production lors du merge dans `main` (`prisma migrate deploy`).

---

## 4. Bonnes pratiques & sécurité
- Variables d’environnement (`.env`) distinctes pour `dev` et `prod`.
- Jamais d’accès direct à la base de prod hors process validé.
- Documentation claire du workflow pour éviter les erreurs.
- Sauvegardes régulières de la base prod.

---

✅ **Avantages de ce setup :**
- Cohérence entre environnements.
- Processus clair pour limiter les erreurs en prod.
- Déploiement automatisé et contrôlé.
- Historique et traçabilité des changements de BDD.
