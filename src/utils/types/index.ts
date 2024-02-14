import { z } from "zod";
import {ObjectId} from "mongodb";

const verifyObjectId = (value: string) => {
  try {
    new ObjectId(value);
    return true;
  }catch {
    return false;
  }

}

// Game
export const gameSchema = z.object({ //Make sure to modify gameSchema endpoints, as well as editGameSchema I suppose.
  name: z.string().min(3).max(50),
  themes: z.array(z.union([z.string().refine(verifyObjectId),z.instanceof(ObjectId)])).optional(),//Ensures  that themes is
  //either a list of 
  tags: z.array(z.union([z.string().refine(verifyObjectId),z.instanceof(ObjectId)])).optional(),
  multiClass: z.boolean(),
  description: z.string().optional(),
  game: z.string().url(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
});

// For editing game
export const editGameSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  themes: z.array(z.union([z.string().refine(verifyObjectId),z.instanceof(ObjectId)])).optional(),
  tags: z.array(z.union([z.string().refine(verifyObjectId),z.instanceof(ObjectId)])).optional(),
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
  games: z.array(z.union([z.string().refine(verifyObjectId),z.instanceof(ObjectId)])).optional(),
});

// Tag
export const tagSchema = z.object({
  name: z.string(),
  games: z.array(z.union([z.string().refine(verifyObjectId),z.instanceof(ObjectId)])).optional(),
});
