const dotenv = require('dotenv');
const { resolve } = require('path');

// Charger les variables d'environnement
dotenv.config({ path: resolve(__dirname, '../.env') });

// Configuration fal.ai directement dans le script
const { fal } = require('@fal-ai/client');

async function testSeedanceConnection() {
  console.log('--- Début du test de connexion à Seedance ---');

  try {
    // 1. Vérifier la configuration
    if (!process.env.FAL_KEY) {
      throw new Error('Variable d\'environnement FAL_KEY manquante. Vérifiez votre .env');
    }
    
    console.log('✅ FAL_KEY configuré');

    // 2. Test simple avec un prompt basique
    const testPrompt = "A person smiling and waving at the camera, professional headshot style";
    console.log(`Test prompt: ${testPrompt}`);
    
    console.log('🚀 Lancement de la génération vidéo (cela peut prendre quelques minutes)...');
    
    // Test direct de l'API Seedance
    const result = await fal.subscribe('fal-ai/bytedance/seedance/v1/pro/text-to-video', {
      input: {
        prompt: testPrompt,
        aspect_ratio: "9:16",
        resolution: "480p", 
        duration: "3",
        camera_fixed: true,
        enable_safety_checker: true
      },
    });
    
    console.log('Résultat Seedance:', result);
    
    const videoUrl = result?.data?.video?.url;

    if (videoUrl) {
      console.log('✅ Génération réussie !');
      console.log('📹 URL de la vidéo:', videoUrl);
      console.log('\n--- 🎉 Test de connexion à Seedance terminé avec succès ! ---');
      return true;
    } else {
      throw new Error('Aucune vidéo retournée par Seedance');
    }
    
  } catch (error) {
    console.error('\n--- 🚨 Erreur lors du test de connexion à Seedance ---');
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
    console.error('Vérifiez votre clé FAL_KEY et votre connexion internet.');
    return false;
  }
}

// Exécuter le test
testSeedanceConnection();