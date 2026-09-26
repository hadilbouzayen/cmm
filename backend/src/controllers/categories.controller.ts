import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

function toSlug(name: string) {
  return name.toLowerCase()
    .replace(/[àâä]/g, "a").replace(/[éèêë]/g, "e")
    .replace(/[îï]/g, "i").replace(/[ôö]/g, "o").replace(/[ùûü]/g, "u")
    .replace(/[ç]/g, "c").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export async function listCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json(categories);
}

export async function createCategory(req: Request, res: Response) {
  const data = categorySchema.parse(req.body);
  let slug = data.slug || toSlug(data.name);
  const existing = await prisma.category.findFirst({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;
  const category = await prisma.category.create({ data: { ...data, slug } });
  res.status(201).json(category);
}

export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const data = categorySchema.partial().parse(req.body);
  const category = await prisma.category.update({ where: { id }, data });
  res.json(category);
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;
  const inUse = await prisma.course.count({ where: { categoryId: id } });
  if (inUse > 0) {
    res.status(409).json({ error: `Impossible de supprimer : ${inUse} formation(s) utilisent cette catégorie.` });
    return;
  }
  await prisma.category.delete({ where: { id } });
  res.status(204).end();
}
