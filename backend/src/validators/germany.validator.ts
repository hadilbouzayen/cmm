import { z } from "zod";

export const germanySchema = z.object({
  title: z.string().min(1),
  type: z.enum(["Ausbildung", "Emploi"]),
  description: z.string().min(1),
  requirements: z.array(z.string()).optional(),
  germanLevel: z.string().optional(),
  duration: z.string().optional(),
  ageRequirement: z.string().optional(),
  location: z.string().optional(),
  sessions: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  applicationInfo: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const germanyUpdateSchema = germanySchema.partial();
