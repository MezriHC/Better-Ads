import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const isAdmin = request.headers.get("x-admin-auth") === "true"
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      )
    }

    // Extraire query et customPayload selon le format officiel Studio Core
    const body = await request.json()
    console.log("Corps complet de la requête:", JSON.stringify(body, null, 2))
    
    const { query, customPayload } = body
    
    console.log("Studio Query reçue:", JSON.stringify(query, null, 2))
    console.log("Custom Payload:", customPayload)

    // Exécuter la requête en suivant le format Studio Core officiel
    const [error, results] = await executeStudioCoreQuery(query)
    
    if (error) {
      console.error("Erreur Studio:", error)
      return NextResponse.json([serializeError(error)])
    }
    
    return NextResponse.json([null, results])
  } catch (error) {
    console.error("Erreur Studio API:", error)
    return NextResponse.json([
      serializeError(error instanceof Error ? error : new Error("Erreur inconnue"))
    ])
  }
}

// Fonction pour sérialiser les erreurs selon le format Studio Core
function serializeError(error: Error) {
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
  }
}

// Types pour Prisma Studio Core
interface StudioQuery {
  sql?: string
  parameters?: unknown[]
  values?: unknown[]
  params?: unknown[]
  type?: string
  action?: string
}

// Fonction principale pour exécuter les requêtes selon le format Studio Core officiel
async function executeStudioCoreQuery(query: StudioQuery): Promise<[Error | null, unknown]> {
  try {
    console.log("Exécution query Studio Core:", JSON.stringify(query, null, 2))

    // Si c'est une requête SQL directe avec la structure attendue
    if (query && query.sql) {
      console.log("SQL détecté:", query.sql)
      console.log("Paramètres détectés:", query.values || query.parameters || [])
      
      const params = query.values || query.parameters || query.params || []
      console.log("Utilisation des paramètres:", params)
      
      const result = await prisma.$queryRawUnsafe(query.sql, ...params)
      return [null, convertBigIntToString(result)]
    }

    // Si c'est juste une string SQL
    if (typeof query === 'string') {
      console.log("SQL string direct:", query)
      const result = await prisma.$queryRawUnsafe(query)
      return [null, convertBigIntToString(result)]
    }

    // Requêtes d'introspection pour récupérer le schéma
    if (query.type === 'introspect' || query.action === 'introspect') {
      const schema = await getSchemaInformation()
      return [null, schema]
    }

    // Health check
    if (query.type === 'ping') {
      await prisma.$queryRaw`SELECT 1`
      return [null, { status: 'connected' }]
    }

    console.warn("Type de requête non géré:", query)
    return [null, { status: 'not_implemented', query }]

  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête:", error)
    return [error instanceof Error ? error : new Error(String(error)), null]
  }
}

// Fonction pour récupérer les informations de schéma
async function getSchemaInformation() {
  try {
    // Récupérer les tables
    const tables = await prisma.$queryRaw`
      SELECT 
        table_name as name,
        table_schema as schema
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `

    // Récupérer les colonnes
    const columns = await prisma.$queryRaw`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `

    return {
      tables: convertBigIntToString(tables),
      columns: convertBigIntToString(columns),
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du schéma:", error)
    throw error
  }
}

// Fonction pour convertir les BigInt en string pour la sérialisation JSON
function convertBigIntToString(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString()
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString)
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertBigIntToString(value)
    }
    return result
  }
  
  return obj
}
