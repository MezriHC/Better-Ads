import { prisma } from '../client'
import type { CreateUserData, UpdateUserData } from '../types'

// Requêtes CRUD pour les utilisateurs
export const userQueries = {
  // Créer un utilisateur
  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
      include: {
        accounts: true,
        sessions: true,
      },
    })
  },

  // Récupérer un utilisateur par ID
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        sessions: true,
      },
    })
  },

  // Récupérer un utilisateur par email
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
      },
    })
  },

  // Mettre à jour un utilisateur
  async update(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        accounts: true,
        sessions: true,
      },
    })
  },

  // Supprimer un utilisateur
  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  },

  // Lister tous les utilisateurs (avec pagination)
  async findMany(skip = 0, take = 10) {
    return prisma.user.findMany({
      skip,
      take,
      include: {
        accounts: true,
        sessions: true,
      },
      orderBy: {
        id: 'desc',
      },
    })
  },

  // Compter le nombre d'utilisateurs
  async count() {
    return prisma.user.count()
  },
}
