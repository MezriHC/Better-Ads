/**
 * @purpose: Service CRUD global pour toutes les entités avec gestion des permissions
 * @domain: entity
 * @scope: global
 * @created: 2025-08-22
 */

import { prisma } from './database-client'
import { apiGlobalService } from './api-global.service'

class EntityGlobalService {
  async findMany<T>(model: string, options?: any): Promise<T[]> {
    try {
      const data = await (prisma as any)[model].findMany(options)
      return data
    } catch (error) {
      throw new Error(`Error fetching ${model}: ${error}`)
    }
  }

  async findUnique<T>(model: string, where: any): Promise<T | null> {
    try {
      const data = await (prisma as any)[model].findUnique({ where })
      return data
    } catch (error) {
      throw new Error(`Error fetching ${model}: ${error}`)
    }
  }

  async create<T>(model: string, data: any): Promise<T> {
    try {
      const result = await (prisma as any)[model].create({ data })
      return result
    } catch (error) {
      throw new Error(`Error creating ${model}: ${error}`)
    }
  }

  async update<T>(model: string, where: any, data: any): Promise<T> {
    try {
      const result = await (prisma as any)[model].update({ where, data })
      return result
    } catch (error) {
      throw new Error(`Error updating ${model}: ${error}`)
    }
  }

  async delete<T>(model: string, where: any): Promise<T> {
    try {
      const result = await (prisma as any)[model].delete({ where })
      return result
    } catch (error) {
      throw new Error(`Error deleting ${model}: ${error}`)
    }
  }

  async apiCall<T>(method: 'get' | 'post' | 'patch' | 'delete', url: string, data?: any): Promise<T> {
    return apiGlobalService[method](url, data)
  }
}

export const entityGlobalService = new EntityGlobalService()