import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

import publicRoutes from "./routes/public.routes";
import adminRoutes from "./routes/admin.routes";
import uploadRoutes from "./routes/upload.routes";
import { errorHandler } from "./middleware/error.middleware";
import { UPLOADS_ROOT } from "./lib/paths";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173", credentials: true }));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(UPLOADS_ROOT));

// Routes
app.use("/api", publicRoutes);
app.use("/api", adminRoutes);
app.use("/api", uploadRoutes);

app.use(errorHandler);

export default app;
