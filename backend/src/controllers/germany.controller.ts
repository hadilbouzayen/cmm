import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { parseArr, serializeArr } from "../utils/json-fields";
import { germanySchema, germanyUpdateSchema } from "../validators/germany.validator";

function hydrate(opp: Record<string, unknown>) {
  return {
    ...opp,
    requirements: parseArr(opp.requirements as string),
    benefits: parseArr(opp.benefits as string),
  };
}

export async function listOpportunities(req: Request, res: Response) {
  const where = req.path.startsWith("/api/germany") ? { status: "active" } : {};
  const opps = await prisma.germanyOpportunity.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(opps.map(hydrate));
}

export async function getOpportunity(req: Request, res: Response) {
  const opp = await prisma.germanyOpportunity.findUnique({ where: { id: req.params.id } });
  if (!opp) { res.status(404).json({ error: "Opportunité introuvable" }); return; }
  res.json(hydrate(opp as unknown as Record<string, unknown>));
}

export async function createOpportunity(req: Request, res: Response) {
  const data = germanySchema.parse(req.body);
  const opp = await prisma.germanyOpportunity.create({
    data: {
      ...data,
      requirements: serializeArr(data.requirements),
      benefits: serializeArr(data.benefits),
    },
  });
  res.status(201).json(hydrate(opp as unknown as Record<string, unknown>));
}

export async function updateOpportunity(req: Request, res: Response) {
  const { id } = req.params;
  const data = germanyUpdateSchema.parse(req.body);
  const update: Record<string, unknown> = { ...data };
  if (data.requirements !== undefined) update.requirements = serializeArr(data.requirements);
  if (data.benefits !== undefined) update.benefits = serializeArr(data.benefits);
  const opp = await prisma.germanyOpportunity.update({ where: { id }, data: update });
  res.json(hydrate(opp as unknown as Record<string, unknown>));
}

export async function deleteOpportunity(req: Request, res: Response) {
  await prisma.germanyOpportunity.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
