import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import path from "path";

const prisma = new PrismaClient();

export async function enableWAL() {
  await prisma.$queryRawUnsafe("PRAGMA journal_mode = WAL;");
  await prisma.$queryRawUnsafe("PRAGMA synchronous = NORMAL;");
  await prisma.$queryRawUnsafe("PRAGMA foreign_keys = ON;");
}

export default prisma;
