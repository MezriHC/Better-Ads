import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../_shared/lib/auth'
import { userQueries } from '../../../_shared/database/queries/user'
import type { UpdateUserRequest } from '../../../_shared/types/api'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/users/[id] - Récupérer un utilisateur
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Récupérer l'utilisateur
    const user = await userQueries.findById(id)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PATCH /api/users/[id] - Mettre à jour un utilisateur
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Vérifier que l'utilisateur existe
    const existingUser = await userQueries.findById(id)
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur peut modifier ses propres données
    if (session.user.id !== id) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Récupérer les données de mise à jour
    const data: UpdateUserRequest = await request.json()

    // Mettre à jour l'utilisateur
    const updatedUser = await userQueries.update(id, data)

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Utilisateur mis à jour avec succès',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Supprimer un utilisateur
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Vérifier que l'utilisateur existe
    const existingUser = await userQueries.findById(id)
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur peut supprimer son propre compte
    if (session.user.id !== id) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Supprimer l'utilisateur
    await userQueries.delete(id)

    return NextResponse.json({
      success: true,
      data: { deleted: true },
      message: 'Utilisateur supprimé avec succès',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
