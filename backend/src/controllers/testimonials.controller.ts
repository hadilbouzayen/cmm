import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(1),
  testimonial: z.string().min(1),
  photo: z.string().optional(),
  language: z.string().optional(),
  published: z.boolean().optional(),
});

export async function listPublishedTestimonials(req: Request, res: Response) {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(testimonials);
}

export async function listAllTestimonials(req: Request, res: Response) {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  res.json(testimonials);
}

export async function createTestimonial(req: Request, res: Response) {
  const data = testimonialSchema.parse(req.body);
  const testimonial = await prisma.testimonial.create({ data });
  res.status(201).json(testimonial);
}

export async function updateTestimonial(req: Request, res: Response) {
  const { id } = req.params;
  const data = testimonialSchema.partial().parse(req.body);
  const testimonial = await prisma.testimonial.update({ where: { id }, data });
  res.json(testimonial);
}

export async function deleteTestimonial(req: Request, res: Response) {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
