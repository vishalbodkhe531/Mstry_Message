import { z } from "zod";

export const useNameValidation = z
  .string()
  .min(2, "userName must be atleast 2 characters")
  .max(20, "userName must be no more than 20 characters")
  .regex(
    /^[a-zA-Z0-9_]{3,20}$/,
    "userName must not contain special charectors"
  );

export const signUpSchema = z.object({
  userName: useNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" })
    .max(8, { message: "Password must be no more than 8 characters" }),
});
