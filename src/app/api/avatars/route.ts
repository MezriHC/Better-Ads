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

    const userId = session.user.email!; // Use email as user ID

    // Détecter le type de contenu (JSON ou FormData)
    const contentType = request.headers.get('content-type');
    let name: string, imageUrl: string, projectId: string, imageFile: File | undefined;

    if (contentType?.includes('application/json')) {
      // Image générée (fal.ai) - JSON classique
      const body = await request.json();
      ({ name, imageUrl, projectId } = body);
    } else {
      // Image uploadée - FormData avec fichier
      const formData = await request.formData();
      name = formData.get('name') as string;
      imageUrl = formData.get('imageUrl') as string;
      projectId = formData.get('projectId') as string;
      imageFile = formData.get('imageFile') as File;

      console.log('📎 Image uploadée reçue:', {
        name,
        fileName: imageFile?.name,
        fileSize: imageFile?.size
      });
    }

    if (!name || !imageUrl || !projectId) {
      return NextResponse.json(
        { error: 'name, imageUrl et projectId sont requis' },
        { status: 400 }
      );
    }

    // Créer l'avatar et lancer la génération
    const avatar = await createAvatar({
      name,
      imageUrl,
      projectId,
      userId,
      imageFile // Passer le fichier s'il existe
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