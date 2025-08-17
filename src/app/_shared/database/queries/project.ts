import { prisma } from '../client'
import type { CreateProjectData, UpdateProjectData } from '../types'

// Requêtes CRUD pour les projets
export const projectQueries = {
  // Créer un projet
  async create(data: CreateProjectData) {
    return prisma.project.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  // Récupérer un projet par ID
  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  // Récupérer tous les projets d'un utilisateur
  async findByUserId(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  // Mettre à jour un projet
  async update(id: string, data: UpdateProjectData) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  // Supprimer un projet
  async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    })
  },

  // Lister tous les projets (avec pagination) - pour admin
  async findMany(skip = 0, take = 10) {
    return prisma.project.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  // Compter le nombre de projets
  async count() {
    return prisma.project.count()
  },

  // Compter le nombre de projets d'un utilisateur
  async countByUserId(userId: string) {
    return prisma.project.count({
      where: { userId },
    })
  },
}
