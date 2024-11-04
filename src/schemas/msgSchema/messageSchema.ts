import { z } from "zod";

export const msgSchemas = z.object({
  content: z
    .string()
    .min(10, { message: "Content code must be in 6 digits" })
    .max(300, { message: "Content must be no more than 300 characters" }),
});
