import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { registrationSchema, registrationStatusSchema } from "../validators/registration.validator";
import { notifyNewLead } from "../lib/notify";

export async function submitRegistration(req: Request, res: Response) {
  const { website, ...data } = registrationSchema.parse(req.body);
  const registration = await prisma.registration.create({ data });
  await notifyNewLead("inscription", { ...data });
  res.status(201).json(registration);
}

export async function listRegistrations(req: Request, res: Response) {
  const registrations = await prisma.registration.findMany({
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(registrations);
}

export async function updateRegistrationStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = registrationStatusSchema.parse(req.body);
  const registration = await prisma.registration.update({ where: { id }, data: { status } });
  res.json(registration);
}

export async function deleteRegistration(req: Request, res: Response) {
  await prisma.registration.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
