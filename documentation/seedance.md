# SeedAnce API Configuration

## Model: `fal-ai/bytedance/seedance/v1/pro/image-to-video`

### Paramètres recommandés pour qualité maximum :

```javascript
{
  prompt: "Your prompt here",
  image_url: "https://your-image-url.jpg",
  resolution: "1080p",        // QUALITÉ MAX: 1080p (au lieu de 720p)
  duration: "12",             // DURÉE MAX: 12 secondes
  camera_fixed: false,        // Mouvement de caméra activé
  seed: -1                    // Seed aléatoire
}
```

### Qualités supportées :
- `480p` - Basse qualité
- `720p` - Qualité standard
- `1080p` - **QUALITÉ MAXIMUM (recommandée)**

### Durées supportées :
- `3` - 3 secondes
- `5` - 5 secondes 
- `12` - **DURÉE MAXIMUM (recommandée)**

### Notes d'implémentation :
- Toujours utiliser `resolution: "1080p"` et `duration: "12"` pour la qualité maximum
- Le paramètre `camera_fixed: false` permet des mouvements de caméra plus dynamiques
- `seed: -1` génère des résultats aléatoires à chaque fois
