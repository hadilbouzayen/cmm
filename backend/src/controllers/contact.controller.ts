import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { contactSchema, contactStatusSchema } from "../validators/contact.validator";

export async function submitContact(req: Request, res: Response) {
  const data = contactSchema.parse(req.body);
  const message = await prisma.contactMessage.create({ data });
  res.status(201).json(message);
}

export async function listMessages(req: Request, res: Response) {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  res.json(messages);
}

export async function updateMessageStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = contactStatusSchema.parse(req.body);
  const message = await prisma.contactMessage.update({ where: { id }, data: { status } });
  res.json(message);
}

export async function deleteMessage(req: Request, res: Response) {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
