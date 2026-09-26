import path from "path";

// Single source of truth for the uploads directory, resolved relative to the
// backend working directory (npm scripts run from backend/). Using one shared
// constant keeps the static server, multer storage, and the controller in sync.
export const UPLOADS_ROOT = path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "../uploads");
