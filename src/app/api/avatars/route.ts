import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../_shared/lib/auth';
import { createAvatar } from './services';

/**
 * POST /api/avatars
 * Crée un nouvel avatar et lance la génération vidéo
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, imageUrl, projectId } = body;

    if (!name || !imageUrl || !projectId) {
      return NextResponse.json(
        { error: 'name, imageUrl et projectId sont requis' },
        { status: 400 }
      );
    }

    const userId = session.user.email!; // Use email as user ID

    // Créer l'avatar et lancer la génération
    const avatar = await createAvatar({
      name,
      imageUrl,
      projectId,
      userId
    });

    console.log(`✅ Avatar créé avec succès: ${avatar.id}`);

    return NextResponse.json(avatar);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'avatar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}