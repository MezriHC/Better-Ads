import { prisma } from '../database-client'
import type { CreateProjectData, UpdateProjectData } from '../types'

export const projectQueries = {
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

  async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    })
  },

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

  async count() {
    return prisma.project.count()
  },

  async countByUserId(userId: string) {
    return prisma.project.count({
      where: { userId },
    })
  },
}
