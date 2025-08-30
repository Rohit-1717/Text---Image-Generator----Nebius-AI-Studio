import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Min 8 chars")
      .max(128)
      .regex(/[A-Z]/, "At least one uppercase")
      .regex(/[a-z]/, "At least one lowercase")
      .regex(/\d/, "At least one number")
      .regex(/[^A-Za-z0-9]/, "At least one symbol"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});
