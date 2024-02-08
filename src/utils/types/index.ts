import { z } from "zod";
import {ObjectId} from "mongodb";
// Game
export const gameSchema = z.object({ //Make sure to modify gameSchema endpoints, as well as editGameSchema I suppose.
  name: z.string().min(3).max(50),
  themes: z.array(z.instanceof(ObjectId)).optional(),
  tags: z.array(z.instanceof(ObjectId)).optional(),
  multiClass: z.boolean(),
  description: z.string().optional(),
  game: z.string().url(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
});

// For editing game
export const editGameSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  themes: z.array(z.instanceof(ObjectId)).optional(),
  tags: z.array(z.instanceof(ObjectId)).optional(),
  multiClass: z.boolean().optional(),
  description: z.string().optional(),
  game: z.string().url().optional(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
});

// User
export const userSchema = z.object({
  email: z.string().min(3).max(50),
  hashedPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  label: z.enum(["Educator", "Student", "Parent", "Administrator"]),
});


// Theme
export const themeSchema = z.object({
  name: z.string(),
  games: z.array(z.instanceof(ObjectId)).optional()
});

// Tag
export const tagSchema = z.object({
  name: z.string(),
  games: z.array(z.instanceof(ObjectId)).optional()
});
