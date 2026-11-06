import fs from "node:fs/promises";
import path from "node:path";

export const BOOK_PHOTO_DIR = path.resolve("uploads/books");
export const BOOK_PHOTO_PUBLIC_PREFIX = "/uploads/books";

export function publicBookPhotoPath(filename: string): string {
  return `${BOOK_PHOTO_PUBLIC_PREFIX}/${filename}`;
}

export async function deleteBookPhoto(publicPath: string | null | undefined): Promise<void> {
  const absolutePath = toAbsolutePhotoPath(publicPath);
  if (!absolutePath) return;

  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") return;
    throw error;
  }
}

function toAbsolutePhotoPath(publicPath: string | null | undefined): string | null {
  if (!publicPath) return null;

  const prefix = `${BOOK_PHOTO_PUBLIC_PREFIX}/`;
  if (!publicPath.startsWith(prefix)) return null;

  const filename = path.basename(publicPath);
  if (filename !== publicPath.slice(prefix.length)) return null;

  return path.join(BOOK_PHOTO_DIR, filename);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
