import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  courseId: z.string().optional(),
  currentLevel: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean(),
});

export const registrationStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "CONFIRMED", "REJECTED", "COMPLETED"]),
});
