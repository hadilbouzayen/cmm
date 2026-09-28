import { Request, Response, NextFunction } from "express";

/**
 * Spec §10 (Essentielle): forms protected against spam.
 * 1) Honeypot: a hidden "website" field browsers leave empty but bots fill.
 * 2) Rate limit: cap submissions per IP over a rolling window.
 */

// Honeypot — reject if the hidden field is filled.
export function honeypot(req: Request, res: Response, next: NextFunction) {
  const trap = (req.body?.website ?? "").toString().trim();
  if (trap.length > 0) {
    // Pretend success so bots get no signal.
    res.status(201).json({ ok: true });
    return;
  }
  next();
}

// Simple in-memory sliding-window rate limiter (per IP).
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    res.status(429).json({ error: "Trop de demandes. Veuillez réessayer dans quelques minutes." });
    return;
  }
  recent.push(now);
  hits.set(ip, recent);
  next();
}
