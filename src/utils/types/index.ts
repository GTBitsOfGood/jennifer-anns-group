import { z } from "zod";

// Game
export const gameSchema = z.object({
  name: z.string().min(3).max(50),
  theme: z.string().min(1).max(100),
  tags: z.array(z.string()).optional(),
  multiClass: z.boolean(),
  description: z.string().optional(),
  game: z.string().url(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
});

// User
export const userSchema = z.object({
  email: z.string().min(3).max(50),
  hashedPassword: z.string(),
});
