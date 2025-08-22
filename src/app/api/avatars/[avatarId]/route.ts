import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../_shared/lib/auth';
import { getAvatarById } from '../services';

/**
 * GET /api/avatars/[avatarId]
 * Récupère les informations d'un avatar spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ avatarId: string }> }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { avatarId } = await params;
    const userId = session.user.email!; // Use email as user ID

    // Récupérer l'avatar
    const avatar = await getAvatarById(avatarId, userId);

    return NextResponse.json(avatar);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'avatar:', error);
    
    if (error instanceof Error && error.message === 'Avatar introuvable') {
      return NextResponse.json(
        { error: 'Avatar introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}