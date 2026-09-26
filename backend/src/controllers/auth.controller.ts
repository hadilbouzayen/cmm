import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { loginSchema } from "../validators/auth.validator";

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    res.status(401).json({ error: "Email ou mot de passe incorrect" });
    return;
  }
  const token = signToken({ id: admin.id, email: admin.email, name: admin.name });
  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
}

export async function me(req: Request, res: Response) {
  const admin = (req as Request & { admin: { id: string; email: string; name: string } }).admin;
  res.json(admin);
}
