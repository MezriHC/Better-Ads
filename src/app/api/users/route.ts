import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../_shared/lib/auth'
import { userQueries } from '../../_shared/database/queries/user'
import type { CreateUserRequest, GetUsersParams } from '../../_shared/types/api'

// GET /api/users - Lister les utilisateurs
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const params: GetUsersParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as 'name' | 'email' | 'createdAt') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    }

    // Calculer skip et take pour Prisma
    const skip = ((params.page || 1) - 1) * (params.limit || 10)
    const take = params.limit || 10

    // Récupérer les utilisateurs
    const users = await userQueries.findMany(skip, take)
    const total = await userQueries.count()

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total,
        totalPages: Math.ceil(total / (params.limit || 10)),
        hasNext: skip + take < total,
        hasPrev: (params.page || 1) > 1,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/users - Créer un utilisateur
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les données de la requête
    const data: CreateUserRequest = await request.json()

    // Validation basique
    if (!data.email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      )
    }

    // Créer l'utilisateur
    const user = await userQueries.create(data)

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Utilisateur créé avec succès',
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
