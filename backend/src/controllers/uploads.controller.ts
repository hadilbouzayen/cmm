import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import prisma from "../lib/prisma";
import { UPLOADS_ROOT } from "../lib/paths";

export async function uploadFile(req: Request, res: Response) {
  if (!req.file) { res.status(400).json({ error: "Aucun fichier reçu" }); return; }

  const { entityType = "misc", entityId } = req.body;

  // Derive the public URL from where multer actually saved the file — robust to folder naming.
  const rel = path.relative(UPLOADS_ROOT, req.file.path).split(path.sep).join("/");
  const publicPath = `/uploads/${rel}`;

  const record = await prisma.uploadedFile.create({
    data: {
      entityType,
      entityId: entityId ?? null,
      folderPath: path.dirname(req.file.path),
      filename: req.file.filename,
      path: publicPath,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    },
  });

  res.status(201).json({ id: record.id, path: publicPath, url: publicPath });
}

export async function listFiles(req: Request, res: Response) {
  const { entityType, entityId } = req.query;
  const where: Record<string, unknown> = {};
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  const files = await prisma.uploadedFile.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(files);
}

export async function deleteFile(req: Request, res: Response) {
  const { id } = req.params;
  const file = await prisma.uploadedFile.findUnique({ where: { id } });
  if (!file) { res.status(404).json({ error: "Fichier introuvable" }); return; }

  const diskPath = path.join(UPLOADS_ROOT, file.path.replace(/^\/uploads\//, ""));
  try {
    await fs.unlink(diskPath);
    await fs.rmdir(path.dirname(diskPath));
  } catch { /* file/folder may already be gone */ }

  await prisma.uploadedFile.delete({ where: { id } });
  res.status(204).end();
}
