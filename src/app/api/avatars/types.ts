import { AvatarType, AvatarStatus } from '@prisma/client';

export interface CreateAvatarParams {
  name: string;
  imageUrl: string; // URL MinIO ou fal.ai
  projectId: string;
  userId: string;
  imageFile?: File; // Fichier original si image uploadée
}

export interface AvatarResponse {
  id: string;
  name: string;
  type: AvatarType;
  status: AvatarStatus;
  falRequestId?: string;
  imageStoragePath: string;
  videoStoragePath?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  projectId?: string;
  project?: {
    id: string;
    name: string;
  };
}

export interface AvatarStatusResponse {
  id: string;
  status: AvatarStatus;
  videoStoragePath?: string;
  updatedAt: Date;
}
