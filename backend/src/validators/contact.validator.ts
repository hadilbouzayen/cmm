import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  consent: z.literal(true, { errorMap: () => ({ message: "Le consentement est requis." }) }),
  website: z.string().optional(), // honeypot
});

export const contactStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "PROCESSED"]),
});
