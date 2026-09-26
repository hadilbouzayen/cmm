import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  centerName: z.string().min(1),
  logo: z.string().optional(),
  phone: z.string().min(1),
  whatsapp: z.string().optional(),
  email: z.string().email(),
  address: z.string().optional(),
  openingHours: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  footerText: z.string().optional(),
});

export async function getSettings(req: Request, res: Response) {
  const settings = await prisma.websiteSettings.findFirst();
  if (!settings) { res.status(404).json({ error: "Paramètres introuvables" }); return; }
  res.json(settings);
}

export async function updateSettings(req: Request, res: Response) {
  const data = settingsSchema.partial().parse(req.body);
  const existing = await prisma.websiteSettings.findFirst();
  if (!existing) { res.status(404).json({ error: "Paramètres introuvables" }); return; }
  const settings = await prisma.websiteSettings.update({ where: { id: existing.id }, data });
  res.json(settings);
}
