import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { enableWAL } from "./lib/prisma";

const PORT = parseInt(process.env.PORT ?? "3000", 10);

async function main() {
  await enableWAL();
  app.listen(PORT, () => {
    console.log(`CMM backend running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
