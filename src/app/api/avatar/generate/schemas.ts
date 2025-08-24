import { z } from 'zod';

export const avatarGenerationSchema = z.object({
  prompt: z.string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(500, 'Prompt must be less than 500 characters'),
  
  imageUrl: z.string()
    .url('Invalid image URL'),
  
  resolution: z.enum(['480p', '720p', '1080p'])
    .default('1080p'),
  
  duration: z.enum(['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .default('5'),
  
  cameraFixed: z.boolean()
    .default(false),
  
  seed: z.number()
    .int()
    .optional(),
  
  enableSafetyChecker: z.boolean()
    .default(true),
});

export type AvatarGenerationInput = z.infer<typeof avatarGenerationSchema>;