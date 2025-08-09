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
  - Frontend Next.js déployé automatiquement depuis la branche `dev`.
  - Test de toutes les features et authentification.
  
- **Environnement de production (Coolify)**  
  - Frontend Next.js déployé automatiquement depuis la branche `main`.
  - Configuration production optimisée.

---

## 3. Gestion des données
- Configuration future à définir selon besoins.
- **Processus à établir :**
  1. Choisir solution de stockage.
  2. Configurer environnements dev/prod.
  3. Mettre en place workflow de déploiement.

---

## 4. Bonnes pratiques & sécurité
- Variables d'environnement (`.env`) distinctes pour `dev` et `prod`.
- Authentification Google OAuth sécurisée.
- Documentation claire du workflow pour éviter les erreurs.
- Configuration production optimisée.

---

✅ **Avantages de ce setup :**
- Cohérence entre environnements.
- Processus clair pour limiter les erreurs en prod.
- Déploiement automatisé et contrôlé.
- Frontend performant et sécurisé.
