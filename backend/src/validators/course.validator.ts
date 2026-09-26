import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  objectives: z.array(z.string()).optional(),
  program: z.array(z.string()).optional(),
  categoryId: z.string().min(1),
  language: z.string().optional(),
  coverImage: z.string().optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  schedule: z.string().optional(),
  price: z.string().optional(),
  location: z.string().optional(),
  instructor: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  availablePlaces: z.number().int().optional(),
  requirements: z.array(z.string()).optional(),
  includedItems: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  featured: z.boolean().optional(),
});

export const courseUpdateSchema = courseSchema.partial();
