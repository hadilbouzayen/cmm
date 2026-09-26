import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(422).json({ error: "Données invalides", details: err.flatten().fieldErrors });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
}
