import { setDefaultAutoSelectFamily } from "net";
import { z } from "zod";

const verifyObjectId = (value: string) => {
  //Instead of converting to an Object, verify that it can be converted into an ObjectId
  const regex_string: RegExp = /[0-9A-Fa-f]{24}/g;
  if (regex_string.test(value)) {
    return true;
  }
  return false;
};

// Build
export enum AppType {
  AmazonApp = "Amazon App",
  AndroidApp = "Android App",
  AppStore = "App Store",
  LinuxDownload = "Linux Download",
  MacDownload = "Mac Download",
  WindowsDownload = "Windows Download",
}

export const buildSchema = z.object({
  type: z.nativeEnum(AppType),
  link: z.string().url(),
  instructions: z.string().optional(),
});

// Theme
export const themeSchema = z.object({
  name: z.string(),
});

// Tag
const tag_types = ["accessibility", "custom"] as const;
export const tagSchema = z.object({
  name: z.string(),
  type: z.enum(tag_types),
});

// Game
//We might need to make two gameSchemas, one for input verification and another

export const gameSchema = z.object({
  //Make sure to modify gameSchema endpoints, as well as editGameSchema I suppose.
  name: z.string().min(3).max(50),
  themes: z.array(z.string().refine(verifyObjectId)).optional(),
  tags: z.array(z.string().refine(verifyObjectId)).optional(),
  webGLBuild: z.boolean().optional(),
  builds: z.array(buildSchema).optional(),
  description: z.string(),
  game: z.string().url(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
  answerKey: z.string().url().optional(),
  videoTrailer: z.string().url().optional(),
});
//Since arrays from req.query are just strings, and need to be converted into arrays.

//For validating game query in the GET endpoint
//Be aware that zod.transform alters the data during parsing.

// For editing game
export const editGameSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  themes: z.array(z.string().refine(verifyObjectId)).optional(),
  tags: z.array(z.string().refine(verifyObjectId)).optional(),
  multiClass: z.boolean().optional(),
  description: z.string().optional(),
  webGLBuild: z.boolean().optional(),
  builds: z.array(buildSchema).optional(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
  answerKey: z.string().url().optional(),
  videoTrailer: z.string().url().optional(),
});

// User
export const userSchema = z.object({
  email: z.string().email("Not a valid email"),
  hashedPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  label: z.enum(["educator", "student", "parent", "administrator"]),
});

// For changing password
export const changePWSchema = z.object({
  oldpassword: z.string(),
  password: z.string().min(8, "Password must contain at least 8 characters."),
  passwordConfirm: z.string(),
});
