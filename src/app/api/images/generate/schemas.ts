import { z } from 'zod';

export const imageGenerationSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(500, 'Prompt must be less than 500 characters'),
  
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional(),
  
  aspectRatio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4'])
    .default('9:16'),
  
  guidanceScale: z.number()
    .min(1)
    .max(20)
    .default(3.5),
});

export type ImageGenerationInput = z.infer<typeof imageGenerationSchema>;