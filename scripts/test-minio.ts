const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({ path: resolve(__dirname, '../.env') });

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME!;

const s3Client = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  region: 'us-east-1', // Default region for MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
});

async function testMinioConnection() {
  console.log('--- Début du test de connexion à MinIO ---');

  try {
    // 1. Vérifier la configuration
    console.log(`Bucket: ${BUCKET_NAME}`);
    console.log(`Endpoint: http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`);
    if (!BUCKET_NAME || !process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
      throw new Error('Variables d\'environnement MinIO manquantes. Vérifiez votre .env.local');
    }

    // 2. Créer un fichier de test en mémoire
    const testFileName = `test-upload-${Date.now()}.txt`;
    const testFileContent = 'Si vous voyez ce fichier, la connexion à MinIO fonctionne !';
    console.log(`Création du fichier de test : ${testFileName}`);

    // 3. Uploader le fichier de test
    console.log('Tentative d\'upload...');
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testFileName,
      Body: testFileContent,
      ContentType: 'text/plain',
    }));
    console.log('✅ Upload réussi !');

    // 4. Supprimer le fichier de test
    console.log('Tentative de suppression...');
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testFileName,
    }));
    console.log('✅ Suppression réussie !');

    console.log('\n--- 🎉 Test de connexion à MinIO terminé avec succès ! ---');
    return true;
  } catch (error) {
    console.error('\n--- 🚨 Erreur lors du test de connexion à MinIO ---');
    if (error instanceof Error) {
        console.error('Message:', error.message);
    }
    console.error('Vérifiez vos variables d\'environnement, la connexion réseau et que le service MinIO est bien démarré.');
    return false;
  }
}

testMinioConnection();
