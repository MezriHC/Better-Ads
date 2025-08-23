import type { User, Account, Session, Project } from '@prisma/client'
export type { User, Account, Session, Project, VerificationToken } from '@prisma/client'

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
