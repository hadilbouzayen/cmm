import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { parseArr, serializeArr } from "../utils/json-fields";
import { courseSchema, courseUpdateSchema } from "../validators/course.validator";

function hydrate(course: Record<string, unknown>) {
  return {
    ...course,
    objectives: parseArr(course.objectives as string),
    program: parseArr(course.program as string),
    requirements: parseArr(course.requirements as string),
    includedItems: parseArr(course.includedItems as string),
  };
}

export async function listCourses(req: Request, res: Response) {
  const { status, featured } = req.query;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (featured === "true") where.featured = true;
  const courses = await prisma.course.findMany({
    where,
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(courses.map(hydrate));
}

export async function getCourseById(req: Request, res: Response) {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!course) { res.status(404).json({ error: "Formation introuvable" }); return; }
  res.json(hydrate(course as unknown as Record<string, unknown>));
}

export async function createCourse(req: Request, res: Response) {
  const data = courseSchema.parse(req.body);
  const course = await prisma.course.create({
    data: {
      ...data,
      objectives: serializeArr(data.objectives),
      program: serializeArr(data.program),
      requirements: serializeArr(data.requirements),
      includedItems: serializeArr(data.includedItems),
    },
    include: { category: true },
  });
  res.status(201).json(hydrate(course as unknown as Record<string, unknown>));
}

export async function updateCourse(req: Request, res: Response) {
  const { id } = req.params;
  const data = courseUpdateSchema.parse(req.body);
  const update: Record<string, unknown> = { ...data };
  if (data.objectives !== undefined) update.objectives = serializeArr(data.objectives);
  if (data.program !== undefined) update.program = serializeArr(data.program);
  if (data.requirements !== undefined) update.requirements = serializeArr(data.requirements);
  if (data.includedItems !== undefined) update.includedItems = serializeArr(data.includedItems);
  const course = await prisma.course.update({
    where: { id },
    data: update,
    include: { category: true },
  });
  res.json(hydrate(course as unknown as Record<string, unknown>));
}

export async function deleteCourse(req: Request, res: Response) {
  await prisma.course.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
