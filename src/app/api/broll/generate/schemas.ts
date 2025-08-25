import { z } from 'zod';

export const brollGenerationSchema = z.object({
  prompt: z.string().min(10, "Le prompt doit contenir au moins 10 caractères").max(500, "Le prompt ne peut pas dépasser 500 caractères"),
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  projectId: z.string().min(1, "L'ID du projet est requis"),
  imageUrl: z.string().url("URL d'image invalide").optional(),
  aspectRatio: z.enum(["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"]).default("16:9").optional(),
  resolution: z.enum(["480p", "720p", "1080p"]).default("480p").optional(),
  duration: z.enum(["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]).default("3").optional(),
  cameraFixed: z.boolean().default(false).optional(),
  seed: z.number().int().optional(),
  enableSafetyChecker: z.boolean().default(true).optional(),
  type: z.string().default("seedance-video").optional(),
  visibility: z.enum(["public", "private"]).default("private").optional(),
});

export type BRollGenerationRequest = z.infer<typeof brollGenerationSchema>;

export const brollUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  visibility: z.enum(["public", "private"]).optional(),
});

export type BRollUpdateRequest = z.infer<typeof brollUpdateSchema>;