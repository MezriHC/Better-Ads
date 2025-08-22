const { S3Client, CreateBucketCommand, DeleteBucketCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({ path: resolve(__dirname, '../.env') });

const OLD_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'mini-prod-media'; // Ancien bucket
const NEW_BUCKET_NAME = 'better-ads'; // Selon Plan.md

const s3Client = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function deleteAllObjectsInBucket(bucketName) {
  try {
    console.log(`🗑️ Suppression de tous les objets dans ${bucketName}...`);
    
    // Lister tous les objets
    const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
    const listedObjects = await s3Client.send(listCommand);
    
    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      // Supprimer chaque objet
      for (const object of listedObjects.Contents) {
        if (object.Key) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: object.Key
          }));
          console.log(`  ✅ Supprimé: ${object.Key}`);
        }
      }
    } else {
      console.log(`  ℹ️ Aucun objet trouvé dans ${bucketName}`);
    }
  } catch (error) {
    console.log(`  ⚠️ Erreur lors de la suppression des objets: ${error}`);
  }
}

async function setupMinioBucket() {
  console.log('--- Configuration du bucket MinIO selon Plan.md ---');
  console.log(`Ancien bucket: ${OLD_BUCKET_NAME}`);
  console.log(`Nouveau bucket: ${NEW_BUCKET_NAME}`);

  try {
    // 1. Supprimer l'ancien bucket (vider d'abord)
    if (OLD_BUCKET_NAME && OLD_BUCKET_NAME !== NEW_BUCKET_NAME) {
      console.log(`\n🗑️ Suppression de l'ancien bucket ${OLD_BUCKET_NAME}...`);
      
      await deleteAllObjectsInBucket(OLD_BUCKET_NAME);
      
      await s3Client.send(new DeleteBucketCommand({ Bucket: OLD_BUCKET_NAME }));
      console.log(`✅ Ancien bucket ${OLD_BUCKET_NAME} supprimé`);
    }

    // 2. Créer le nouveau bucket
    console.log(`\n🪣 Création du nouveau bucket ${NEW_BUCKET_NAME}...`);
    await s3Client.send(new CreateBucketCommand({ Bucket: NEW_BUCKET_NAME }));
    console.log(`✅ Nouveau bucket ${NEW_BUCKET_NAME} créé`);

    // 3. Test du nouveau bucket
    console.log(`\n🧪 Test du nouveau bucket...`);
    const testFile = `test-${Date.now()}.txt`;
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    
    await s3Client.send(new PutObjectCommand({
      Bucket: NEW_BUCKET_NAME,
      Key: testFile,
      Body: 'Test du nouveau bucket Better Ads',
      ContentType: 'text/plain',
    }));
    
    await s3Client.send(new DeleteObjectCommand({
      Bucket: NEW_BUCKET_NAME,
      Key: testFile,
    }));
    
    console.log(`✅ Test réussi !`);

    console.log('\n--- 🎉 Configuration MinIO terminée avec succès ! ---');
    console.log(`➡️ Mettez à jour votre .env :`);
    console.log(`MINIO_BUCKET_NAME="${NEW_BUCKET_NAME}"`);
    
    return true;
  } catch (error) {
    console.error('\n--- 🚨 Erreur lors de la configuration MinIO ---');
    console.error('Erreur:', error);
    return false;
  }
}

setupMinioBucket();