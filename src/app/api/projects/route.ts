import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../_shared/lib/auth'
import { projectQueries } from '../../_shared/database/queries/project'
import { z } from 'zod'

// Schéma de validation pour créer un projet
const createProjectSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis').max(100, 'Le nom du projet ne peut pas dépasser 100 caractères'),
})

// GET /api/projects - Récupérer tous les projets de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const projects = await projectQueries.findByUserId((session!.user as any).id)

    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Créer un nouveau projet
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await projectQueries.create({
      name: validatedData.name,
      userId: (session!.user as any).id,
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
