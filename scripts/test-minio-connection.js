const { S3Client, ListBucketsCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
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

async function testMinioConnection() {
  console.log('--- Test de connexion MinIO ---');
  
  try {
    // 1. Lister tous les buckets
    console.log('🪣 Listage des buckets...');
    const listBucketsResponse = await s3Client.send(new ListBucketsCommand({}));
    
    console.log('Buckets trouvés:');
    listBucketsResponse.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name} (créé le ${bucket.CreationDate})`);
    });
    
    // 2. Vérifier le bucket better-ads
    const targetBucket = 'better-ads';
    const bucketExists = listBucketsResponse.Buckets?.some(b => b.Name === targetBucket);
    
    if (!bucketExists) {
      throw new Error(`❌ Le bucket "${targetBucket}" n'existe pas !`);
    }
    
    console.log(`✅ Le bucket "${targetBucket}" existe et est accessible`);
    
    // 3. Lister le contenu du bucket better-ads
    console.log(`\n📁 Contenu du bucket "${targetBucket}":`);
    const listObjectsResponse = await s3Client.send(new ListObjectsV2Command({
      Bucket: targetBucket,
      MaxKeys: 10 // Limiter pour ne pas surcharger
    }));
    
    if (listObjectsResponse.Contents && listObjectsResponse.Contents.length > 0) {
      console.log(`  Objets trouvés (${listObjectsResponse.Contents.length}):`);
      listObjectsResponse.Contents.forEach(obj => {
        console.log(`    - ${obj.Key} (${obj.Size} bytes)`);
      });
    } else {
      console.log('  📭 Bucket vide (prêt pour les nouveaux avatars)');
    }
    
    console.log('\n🎉 Connexion MinIO réussie ! Le bucket "better-ads" est opérationnel.');
    return true;
    
  } catch (error) {
    console.error('\n❌ Erreur de connexion MinIO:', error.message);
    return false;
  }
}

testMinioConnection();