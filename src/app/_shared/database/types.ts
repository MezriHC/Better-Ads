// Types de base de données et utilitaires Prisma
import type { User, Account, Session } from '@prisma/client'
export type { User, Account, Session, VerificationToken } from '@prisma/client'

// Types utilitaires pour les opérations CRUD
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
