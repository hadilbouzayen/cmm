import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import fs from "fs";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadFile, listFiles, deleteFile } from "../controllers/uploads.controller";
import { UPLOADS_ROOT } from "../lib/paths";
import { asyncHandler } from "../utils/async-handler";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const entityType = (req.body.entityType as string) || "misc";
    const id = uuid();
    (req as typeof req & { _uploadId: string })._uploadId = id;
    const dir = path.join(UPLOADS_ROOT, entityType, id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const id = (req as typeof req & { _uploadId: string })._uploadId || uuid();
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|gif|pdf/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

const router = Router();

router.post("/uploads", requireAuth, upload.single("file"), asyncHandler(uploadFile));
router.get("/uploads", requireAuth, asyncHandler(listFiles));
router.delete("/uploads/:id", requireAuth, asyncHandler(deleteFile));

export default router;
