import type { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { BOOK_PHOTO_DIR } from "../lib/bookPhotos";
import { STORAGE_PHOTO_DIR } from "../lib/storagePhotos";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadStoragePhoto = createImageUpload(STORAGE_PHOTO_DIR);
export const uploadBookPhoto = createImageUpload(BOOK_PHOTO_DIR);

function createImageUpload(destination: string) {
  fs.mkdirSync(destination, { recursive: true });

  const storage = multer.diskStorage({
    destination,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${randomUUID()}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true);
        return;
      }

      cb(new Error("Only jpeg, png and webp images are allowed"));
    },
  }).single("photo");
}

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
