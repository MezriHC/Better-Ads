import { z } from 'zod';

export const imageToImageRequestSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required." }),
  imageUrl: z.string().url({ message: "Invalid image URL." }),
});

export type ImageToImageRequest = z.infer<typeof imageToImageRequestSchema>;
