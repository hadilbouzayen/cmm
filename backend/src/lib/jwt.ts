import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
const EXPIRES = "7d";

export function signToken(payload: { id: string; email: string; name: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

export function verifyToken(token: string): { id: string; email: string; name: string } {
  return jwt.verify(token, SECRET) as { id: string; email: string; name: string };
}
