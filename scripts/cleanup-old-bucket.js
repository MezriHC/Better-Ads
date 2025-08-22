const { S3Client, DeleteBucketCommand, ListObjectsV2Command, DeleteObjectCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({ path: resolve(__dirname, '../.env') });

const useSSL = process.env.MINIO_USE_SSL === 'true';
const protocol = useSSL ? 'https' : 'http';
const port = process.env.MINIO_PORT || (useSSL ? '443' : '9000');

const s3Client = new S3Client({
  endpoint: `${protocol}://${process.env.MINIO_ENDPOINT}:${port}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function deleteAllObjectsInBucket(bucketName) {
  try {
    console.log(`🗑️ Suppression de tous les objets dans "${bucketName}"...`);
    
    const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
    const listedObjects = await s3Client.send(listCommand);
    
    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      console.log(`   Trouvé ${listedObjects.Contents.length} objets à supprimer...`);
      
      for (const object of listedObjects.Contents) {
        if (object.Key) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: object.Key
          }));
          console.log(`   ✅ Supprimé: ${object.Key}`);
        }
      }
    } else {
      console.log(`   📭 Bucket "${bucketName}" déjà vide`);
    }
  } catch (error) {
    console.log(`   ⚠️ Erreur lors de la suppression des objets: ${error.message}`);
  }
}

async function cleanupOldBucket() {
  console.log('--- Nettoyage du MinIO : Suppression de "mini-prod-media" ---');
  console.log(`Connexion à: ${protocol}://${process.env.MINIO_ENDPOINT}:${port}`);
  
  try {
    // 1. Lister les buckets actuels
    console.log('\n🪣 État actuel des buckets:');
    const listResponse = await s3Client.send(new ListBucketsCommand({}));
    
    listResponse.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name} (créé le ${bucket.CreationDate})`);
    });
    
    // 2. Vérifier si mini-prod-media existe
    const oldBucketExists = listResponse.Buckets?.some(b => b.Name === 'mini-prod-media');
    
    if (!oldBucketExists) {
      console.log('\n✅ Le bucket "mini-prod-media" n\'existe pas (déjà supprimé)');
      
      // Vérifier que better-ads existe
      const newBucketExists = listResponse.Buckets?.some(b => b.Name === 'better-ads');
      if (newBucketExists) {
        console.log('✅ Le bucket "better-ads" est présent et opérationnel');
        console.log('\n🎉 Nettoyage terminé ! Votre MinIO est propre.');
        return true;
      } else {
        console.log('❌ ATTENTION: Le bucket "better-ads" n\'existe pas non plus !');
        return false;
      }
    }
    
    // 3. Supprimer le contenu de mini-prod-media
    await deleteAllObjectsInBucket('mini-prod-media');
    
    // 4. Supprimer le bucket mini-prod-media
    console.log('\n🗑️ Suppression du bucket "mini-prod-media"...');
    await s3Client.send(new DeleteBucketCommand({ 
      Bucket: 'mini-prod-media' 
    }));
    
    console.log('✅ Bucket "mini-prod-media" supprimé avec succès !');
    
    // 5. Vérification finale
    console.log('\n🔍 État final des buckets:');
    const finalListResponse = await s3Client.send(new ListBucketsCommand({}));
    
    finalListResponse.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name} (créé le ${bucket.CreationDate})`);
    });
    
    console.log('\n🎉 Nettoyage terminé ! Votre MinIO ne contient plus que "better-ads".');
    console.log('   Vérifiez dans votre console: https://minio.trybetterads.com');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Erreur lors du nettoyage:', error.message);
    return false;
  }
}

cleanupOldBucket();