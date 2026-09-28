import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Express 4 does not forward rejections from async handlers to the error
 * middleware — an unhandled rejection crashes the process. Wrap async handlers
 * so thrown/rejected errors (e.g. ZodError) reach errorHandler and return a
 * proper 4xx/5xx instead of taking the server down.
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
