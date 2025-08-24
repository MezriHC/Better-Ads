import { z } from 'zod';

export const videoGenerationSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt must be less than 1000 characters'),
  
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
});

export type VideoGenerationInput = z.infer<typeof videoGenerationSchema>;