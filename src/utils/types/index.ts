import { z } from "zod";

// Game
export const gameSchema = z.object({
  name: z.string().min(3).max(50),
});

// User
export const userSchema = z.object({
  email: z.string().min(3).max(50),
  hashedPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  label: z.enum(["Educator", "Student", "Parent"])
});
