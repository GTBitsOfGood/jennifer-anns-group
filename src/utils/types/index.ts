import { z } from "zod";

const verifyObjectId = (value: string) => {
  //Instead of converting to an Object, verify that it can be converted into an ObjectId
  const regex_string: RegExp = /[0-9A-Fa-f]{24}/g;
  if (regex_string.test(value)) {
    return true;
  }
  return false;
};

// Game
export const gameSchema = z.object({
  //Make sure to modify gameSchema endpoints, as well as editGameSchema I suppose.
  name: z.string().min(3).max(50),
  themes: z.array(z.string().refine(verifyObjectId)).optional(),
  tags: z.array(z.string().refine(verifyObjectId)).optional(),
  description: z.string(),
  game: z.string().url(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
});

// For editing game
export const editGameSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  themes: z.array(z.string().refine(verifyObjectId)).optional(),
  tags: z.array(z.string().refine(verifyObjectId)).optional(),
  multiClass: z.boolean().optional(),
  description: z.string().optional(),
  game: z.string().url().optional(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
});

// User
export const userSchema = z.object({
  email: z.string().email(),
  hashedPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  label: z.enum(["educator", "student", "parent", "administrator"]),
});

// Theme
export const themeSchema = z.object({
  name: z.string(),
});

// Tag
const tag_types = ["accessibility", "custom"] as const; //
export const tagSchema = z.object({
  name: z.string(),
  type: z.enum(tag_types),
});
