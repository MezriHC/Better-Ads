// Types de base de données et utilitaires Prisma
import type { User, Account, Session, Project } from '@prisma/client'
export type { User, Account, Session, Project, VerificationToken } from '@prisma/client'

// Types utilitaires pour les opérations CRUD - User
export type CreateUserData = {
  name?: string
  email: string
  image?: string
}

export type UpdateUserData = Partial<{
  name: string
  email: string
  image: string
}>

export type UserWithAccounts = User & {
  accounts: Account[]
}

export type UserWithSessions = User & {
  sessions: Session[]
}

export type UserWithProjects = User & {
  projects: Project[]
}

// Types utilitaires pour les opérations CRUD - Project
export type CreateProjectData = {
  name: string
  userId: string
}

export type UpdateProjectData = Partial<{
  name: string
}>

export type ProjectWithUser = Project & {
  user: {
    id: string
    name: string | null
    email: string | null
  }
}
