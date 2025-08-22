const { S3Client, ListBucketsCommand, DeleteBucketCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Configuration pour l'ancienne instance MinIO (IP directe)
const oldS3Client = new S3Client({
  endpoint: 'http://85.215.140.65:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'b7bp7ww8BI5UAGAf',
    secretAccessKey: '2ar9JuNQ3fmWeiRKfdZSK3PHIAiTyG6M',
  },
  forcePathStyle: true,
});

async function deleteAllObjectsInBucket(bucketName, client) {
  try {
    console.log(`🗑️ Suppression de tous les objets dans "${bucketName}" (ancienne instance)...`);
    
    const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
    const listedObjects = await client.send(listCommand);
    
    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      console.log(`   Trouvé ${listedObjects.Contents.length} objets à supprimer...`);
      
      for (const object of listedObjects.Contents) {
        if (object.Key) {
          await client.send(new DeleteObjectCommand({
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

async function cleanupOldMinioInstance() {
  console.log('--- Nettoyage de l\'ancienne instance MinIO (IP directe) ---');
  console.log('Connexion à: http://85.215.140.65:9000');
  
  try {
    // 1. Lister les buckets sur l'ancienne instance
    console.log('\n🪣 Buckets sur l\'ancienne instance MinIO:');
    const listResponse = await oldS3Client.send(new ListBucketsCommand({}));
    
    if (!listResponse.Buckets || listResponse.Buckets.length === 0) {
      console.log('   📭 Aucun bucket trouvé (déjà nettoyé)');
      console.log('✅ L\'ancienne instance MinIO est déjà propre !');
      return true;
    }
    
    listResponse.Buckets.forEach(bucket => {
      console.log(`  - ${bucket.Name} (créé le ${bucket.CreationDate})`);
    });
    
    // 2. Supprimer tous les buckets de l'ancienne instance
    for (const bucket of listResponse.Buckets) {
      if (bucket.Name) {
        console.log(`\n🗑️ Suppression du bucket "${bucket.Name}" sur l'ancienne instance...`);
        
        // Vider le bucket
        await deleteAllObjectsInBucket(bucket.Name, oldS3Client);
        
        // Supprimer le bucket
        await oldS3Client.send(new DeleteBucketCommand({ 
          Bucket: bucket.Name 
        }));
        
        console.log(`✅ Bucket "${bucket.Name}" supprimé de l'ancienne instance`);
      }
    }
    
    // 3. Vérification finale
    console.log('\n🔍 Vérification finale de l\'ancienne instance...');
    const finalListResponse = await oldS3Client.send(new ListBucketsCommand({}));
    
    if (!finalListResponse.Buckets || finalListResponse.Buckets.length === 0) {
      console.log('✅ L\'ancienne instance MinIO est maintenant vide !');
      console.log('\n🎉 Nettoyage terminé ! Plus de confusion possible entre les instances.');
      console.log('   Seule l\'instance https://minioapi.trybetterads.com est maintenant utilisée.');
      return true;
    } else {
      console.log('⚠️ Il reste encore des buckets sur l\'ancienne instance:');
      finalListResponse.Buckets.forEach(bucket => {
        console.log(`  - ${bucket.Name}`);
      });
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ Erreur lors du nettoyage de l\'ancienne instance:', error.message);
    
    // Si on ne peut pas se connecter, c'est probablement bon signe
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('✅ L\'ancienne instance MinIO n\'est plus accessible (c\'est normal)');
      return true;
    }
    
    return false;
  }
}

cleanupOldMinioInstance();