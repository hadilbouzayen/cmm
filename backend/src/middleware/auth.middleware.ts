import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  try {
    const token = header.slice(7);
    const payload = verifyToken(token);
    (req as Request & { admin: typeof payload }).admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
}
