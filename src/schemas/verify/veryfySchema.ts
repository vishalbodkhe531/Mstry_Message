import { z } from "zod";

export const varifySchema = z.object({
  code: z.string().length(6, "Varification code must be in 6 digits"),
});
