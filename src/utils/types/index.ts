import { z } from "zod";

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

// Game
export const gameSchema = z.object({
  name: z.string().min(3).max(50),
  theme: z.string().min(1).max(100),
  tags: z.array(z.string()).optional(),
  multiClass: z.boolean(),
  description: z.string().optional(),
  webGLBuild: z.boolean(),
  builds: z.array(buildSchema).optional(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
});

// For editing game
export const editGameSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  theme: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
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
