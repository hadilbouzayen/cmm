import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  consent: z.boolean(),
});

export const contactStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "PROCESSED"]),
});
