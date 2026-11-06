import { Request, Response } from "express";
import { deleteBookPhoto, publicBookPhotoPath } from "../lib/bookPhotos";
import * as bookService from "../services/book.service";

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await bookService.getBooks();
    res.json(books);
  } catch {
    res.status(500).json({
      message: "Failed to get books",
    });
  }
};

export const getBooksByStorageLocationId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const books = await bookService.getBooksByStorageLocationId(id as string);

    if (!books) {
      res.status(404).json({ message: "Storage location not found" });
      return;
    }

    res.json(books);
  } catch {
    res.status(500).json({
      message: "Failed to get books",
    });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id as string);

    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.json(book);
  } catch {
    res.status(500).json({
      message: "Failed to get book",
    });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const title = requiredText(req.body.title);
    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const author = parseAuthor(req.body.author);
    if (!author.ok) {
      res.status(400).json({ message: "Invalid author" });
      return;
    }

    const storageLocationId = parseStorageLocationId(req.body.storageLocationId);
    if (!storageLocationId.ok) {
      res.status(400).json({ message: "Invalid storage location id" });
      return;
    }

    const book = await bookService.createBook({
      title,
      author: author.value,
      storageLocationId: storageLocationId.value,
      photo: req.file ? publicBookPhotoPath(req.file.filename) : undefined,
    });

    res.status(201).json(book);
  } catch (error) {
    await discardUploadedPhoto(req.file);

    if (error instanceof bookService.StorageLocationNotFoundError) {
      res.status(400).json({ message: "Storage location not found" });
      return;
    }

    res.status(500).json({
      message: "Failed to create book",
    });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: {
      title?: string;
      author?: string | null;
      storageLocationId?: number | null;
      photo?: string;
    } = {};

    if (req.body.title !== undefined) {
      const title = requiredText(req.body.title);
      if (!title) {
        res.status(400).json({ message: "Title is required" });
        return;
      }
      data.title = title;
    }

    if (req.body.author !== undefined) {
      const author = parseAuthor(req.body.author);
      if (!author.ok) {
        res.status(400).json({ message: "Invalid author" });
        return;
      }
      data.author = author.value ?? null;
    }

    if (req.body.storageLocationId !== undefined) {
      const storageLocationId = parseStorageLocationId(req.body.storageLocationId);
      if (!storageLocationId.ok) {
        res.status(400).json({ message: "Invalid storage location id" });
        return;
      }
      data.storageLocationId = storageLocationId.value ?? null;
    }

    if (req.file) {
      data.photo = publicBookPhotoPath(req.file.filename);
    }

    const book = await bookService.updateBook(id as string, data);

    if (!book) {
      await discardUploadedPhoto(req.file);
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.json(book);
  } catch (error) {
    if (error instanceof bookService.StorageLocationNotFoundError) {
      await discardUploadedPhoto(req.file);
      res.status(400).json({ message: "Storage location not found" });
      return;
    }

    res.status(500).json({
      message: "Failed to update book",
    });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookService.deleteBook(id as string);

    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.json(book);
  } catch {
    res.status(500).json({
      message: "Failed to delete book",
    });
  }
};

async function discardUploadedPhoto(file: Express.Multer.File | undefined) {
  if (!file) return;
  await deleteBookPhoto(publicBookPhotoPath(file.filename));
}

function requiredText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function parseAuthor(
  value: unknown,
): { ok: true; value: string | null | undefined } | { ok: false } {
  if (value === undefined) return { ok: true, value: undefined };
  if (value === null) return { ok: true, value: null };
  if (typeof value !== "string") return { ok: false };

  const trimmed = value.trim();
  return { ok: true, value: trimmed === "" ? null : trimmed };
}

function parseStorageLocationId(
  value: unknown,
): { ok: true; value: number | null | undefined } | { ok: false } {
  if (value === undefined) return { ok: true, value: undefined };
  if (value === null || value === "") return { ok: true, value: null };

  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isInteger(parsed) || parsed <= 0) return { ok: false };

  return { ok: true, value: parsed };
}
