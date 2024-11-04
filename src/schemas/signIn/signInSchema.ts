import { z } from "zod";

export const signInSchema = z.object({
  identifiers: z.string(),
  password: z.string(),
});
