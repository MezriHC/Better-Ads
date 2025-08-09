#!/usr/bin/env node
/**
 * Supabase Access Check
 * - Vérifie l'accès admin via service role (listUsers)
 * - Vérifie l'accès Storage (create/delete bucket)
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function exitWithError(message, details) {
  console.error(`❌ ${message}`)
  if (details) {
    console.error(details)
  }
  process.exit(1)
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    await exitWithError('Variables d\'environnement manquantes: SUPABASE_URL et/ou SUPABASE_SERVICE_ROLE_KEY')
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // 1) Test admin auth: list users
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
  if (usersError) {
    await exitWithError('Accès admin (auth.admin.listUsers) a échoué', usersError)
  }
  console.log('✅ Accès admin OK (auth.admin.listUsers)')

  // 2) Test storage: create/delete bucket
  const bucketName = `access-check-${Date.now()}`
  const { error: createBucketError } = await supabase.storage.createBucket(bucketName, { public: false })
  if (createBucketError) {
    await exitWithError('Création de bucket storage a échoué', createBucketError)
  }
  console.log(`✅ Bucket créé: ${bucketName}`)

  const { error: deleteBucketError } = await supabase.storage.deleteBucket(bucketName)
  if (deleteBucketError) {
    await exitWithError('Suppression de bucket storage a échoué', deleteBucketError)
  }
  console.log(`✅ Bucket supprimé: ${bucketName}`)

  console.log('\n🎉 Accès Supabase confirmé: ADMIN + STORAGE opérationnels')
}

main().catch((err) => {
  console.error('❌ Erreur inattendue:', err)
  process.exit(1)
})


