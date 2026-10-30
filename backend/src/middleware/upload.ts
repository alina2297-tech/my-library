import type { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { STORAGE_PHOTO_DIR } from "../lib/storagePhotos";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

fs.mkdirSync(STORAGE_PHOTO_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: STORAGE_PHOTO_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadStoragePhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only jpeg, png and webp images are allowed"));
  },
}).single("photo");

export function handleUploadError(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ message: "File is too large" });
      return;
    }

    res.status(400).json({ message: error.message });
    return;
  }

  if (error instanceof Error && error.message === "Only jpeg, png and webp images are allowed") {
    res.status(400).json({ message: error.message });
    return;
  }

  next(error);
}
