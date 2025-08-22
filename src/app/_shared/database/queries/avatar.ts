import { AvatarType, AvatarStatus } from '@prisma/client';
import { prisma } from '../client';

/**
 * Requêtes database spécialisées pour les avatars
 */

/**
 * Récupère tous les avatars d'un utilisateur pour un projet donné
 */
export async function getProjectAvatars(userId: string, projectId: string) {
  return await prisma.avatar.findMany({
    where: {
      userId,
      projectId,
      type: AvatarType.PRIVATE
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      project: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}

/**
 * Récupère tous les avatars d'un utilisateur (tous projets confondus)
 */
export async function getUserAvatars(userId: string) {
  return await prisma.avatar.findMany({
    where: {
      userId,
      type: AvatarType.PRIVATE
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      project: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}

/**
 * Récupère les avatars publics avec filtrage par tags optionnel
 */
export async function getPublicAvatars(tagIds?: string[]) {
  const where: {
    type: AvatarType;
    status: AvatarStatus;
    tags?: {
      some: {
        id: {
          in: string[];
        };
      };
    };
  } = {
    type: AvatarType.PUBLIC,
    status: AvatarStatus.SUCCEEDED
  };

  if (tagIds && tagIds.length > 0) {
    where.tags = {
      some: {
        id: {
          in: tagIds
        }
      }
    };
  }

  return await prisma.avatar.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
          category: true
        }
      }
    }
  });
}

/**
 * Compte les avatars par statut pour un utilisateur
 */
export async function getAvatarStats(userId: string) {
  const stats = await prisma.avatar.groupBy({
    by: ['status'],
    where: {
      userId,
      type: AvatarType.PRIVATE
    },
    _count: {
      _all: true
    }
  });

  // Transformer en objet plus lisible
  const result = {
    pending: 0,
    succeeded: 0,
    failed: 0,
    total: 0
  };

  stats.forEach(stat => {
    const count = stat._count._all;
    result.total += count;
    
    switch (stat.status) {
      case AvatarStatus.PENDING:
        result.pending = count;
        break;
      case AvatarStatus.SUCCEEDED:
        result.succeeded = count;
        break;
      case AvatarStatus.FAILED:
        result.failed = count;
        break;
    }
  });

  return result;
}

/**
 * Récupère un avatar avec toutes ses relations
 */
export async function getAvatarWithDetails(avatarId: string, userId?: string) {
  const where: { id: string; userId?: string } = { id: avatarId };
  
  // Si userId fourni, limiter aux avatars de cet utilisateur
  if (userId) {
    where.userId = userId;
  }

  return await prisma.avatar.findUnique({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      project: {
        select: {
          id: true,
          name: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true,
          category: true
        }
      }
    }
  });
}

/**
 * Récupère les avatars en cours de génération (pour monitoring)
 */
export async function getPendingAvatars() {
  return await prisma.avatar.findMany({
    where: {
      status: AvatarStatus.PENDING
    },
    include: {
      user: {
        select: {
          id: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc' // Plus anciens en premier
    }
  });
}

/**
 * Nettoie les avatars temporaires anciens (échec ou abandonnés)
 */
export async function cleanupOldFailedAvatars(olderThanDays: number = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  return await prisma.avatar.deleteMany({
    where: {
      status: AvatarStatus.FAILED,
      createdAt: {
        lt: cutoffDate
      }
    }
  });
}