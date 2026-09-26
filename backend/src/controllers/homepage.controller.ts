import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { z } from "zod";

const homepageSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroDescription: z.string().min(1),
  germanyTitle: z.string().min(1),
  germanyText: z.string().min(1),
  ctaTitle: z.string().min(1),
  ctaText: z.string().min(1),
});

export async function getHomepage(req: Request, res: Response) {
  const content = await prisma.homepageContent.findFirst();
  if (!content) { res.status(404).json({ error: "Contenu introuvable" }); return; }
  res.json(content);
}

export async function updateHomepage(req: Request, res: Response) {
  const data = homepageSchema.partial().parse(req.body);
  const existing = await prisma.homepageContent.findFirst();
  if (!existing) { res.status(404).json({ error: "Contenu introuvable" }); return; }
  const content = await prisma.homepageContent.update({ where: { id: existing.id }, data });
  res.json(content);
}
