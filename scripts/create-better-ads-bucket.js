const { S3Client, CreateBucketCommand, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
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

async function createBetterAdsBucket() {
  console.log('--- Création du bucket "better-ads" ---');
  console.log(`Connexion à: ${protocol}://${process.env.MINIO_ENDPOINT}:${port}`);
  
  try {
    // 1. Vérifier les buckets existants
    console.log('🪣 Listage des buckets existants...');
    const listResponse = await s3Client.send(new ListBucketsCommand({}));
    
    console.log('Buckets actuels:');
    listResponse.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name}`);
    });
    
    // 2. Vérifier si better-ads existe déjà
    const bucketExists = listResponse.Buckets?.some(b => b.Name === 'better-ads');
    
    if (bucketExists) {
      console.log('✅ Le bucket "better-ads" existe déjà !');
      return true;
    }
    
    // 3. Créer le bucket better-ads
    console.log('\n🪣 Création du bucket "better-ads"...');
    await s3Client.send(new CreateBucketCommand({
      Bucket: 'better-ads'
    }));
    
    console.log('✅ Bucket "better-ads" créé avec succès !');
    
    // 4. Test du bucket avec un fichier de test
    console.log('\n🧪 Test du bucket avec un fichier temporaire...');
    const testFile = `test-${Date.now()}.txt`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: 'better-ads',
      Key: testFile,
      Body: 'Test du bucket Better Ads - Fichier créé automatiquement',
      ContentType: 'text/plain',
    }));
    
    console.log(`✅ Fichier de test "${testFile}" créé avec succès !`);
    
    // 5. Vérification finale
    console.log('\n🔍 Vérification finale...');
    const finalListResponse = await s3Client.send(new ListBucketsCommand({}));
    const betterAdsBucket = finalListResponse.Buckets?.find(b => b.Name === 'better-ads');
    
    if (betterAdsBucket) {
      console.log(`🎉 SUCCESS ! Le bucket "better-ads" est opérationnel !`);
      console.log(`   Créé le: ${betterAdsBucket.CreationDate}`);
      console.log(`\n➡️  Vous devriez maintenant voir le bucket "better-ads" dans votre console MinIO:`);
      console.log(`   https://minio.trybetterads.com`);
      return true;
    } else {
      throw new Error('Le bucket n\'apparaît pas dans la liste finale');
    }
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la création du bucket:', error.message);
    return false;
  }
}

createBetterAdsBucket();