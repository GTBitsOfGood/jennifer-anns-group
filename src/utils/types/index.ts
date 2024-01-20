import { z } from "zod";

// Game
export const gameSchema = z.object({
  name: z.string().min(3).max(50),
});
