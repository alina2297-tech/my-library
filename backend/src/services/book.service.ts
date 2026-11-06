import { deleteBookPhoto } from "../lib/bookPhotos";
import { prisma } from "../lib/prisma";

export class StorageLocationNotFoundError extends Error {
  constructor() {
    super("Storage location not found");
    this.name = "StorageLocationNotFoundError";
  }
}

type BookData = {
  title?: string;
  author?: string | null;
  storageLocationId?: number | null;
  photo?: string;
};

export const getBooks = () => {
  return prisma.book.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBooksByStorageLocationId = async (id: string) => {
  const storageLocationId = parseId(id);
  if (storageLocationId === null) return null;

  const location = await prisma.storageLocation.findUnique({
    where: { id: storageLocationId },
    include: {
      books: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return location?.books ?? null;
};

export const getBookById = (id: string) => {
  const bookId = parseId(id);
  if (bookId === null) return null;

  return prisma.book.findUnique({
    where: { id: bookId },
  });
};

export const createBook = async (data: {
  title: string;
  author?: string | null;
  storageLocationId?: number | null;
  photo?: string;
}) => {
  await assertStorageLocation(data.storageLocationId);

  return prisma.book.create({ data });
};

export const updateBook = async (id: string, data: BookData) => {
  const bookId = parseId(id);
  if (bookId === null) return null;

  const existing = await prisma.book.findUnique({
    where: { id: bookId },
  });
  if (!existing) return null;

  await assertStorageLocation(data.storageLocationId);

  const book = await prisma.book.update({
    where: { id: bookId },
    data,
  });

  if (data.photo && existing.photo && existing.photo !== data.photo) {
    await deleteBookPhoto(existing.photo);
  }

  return book;
};

export const deleteBook = async (id: string) => {
  const bookId = parseId(id);
  if (bookId === null) return null;

  const existing = await prisma.book.findUnique({
    where: { id: bookId },
  });
  if (!existing) return null;

  const book = await prisma.book.delete({
    where: { id: bookId },
  });

  await deleteBookPhoto(existing.photo);

  return book;
};

function parseId(id: string): number | null {
  if (!/^\d+$/.test(id)) return null;

  const parsed = Number(id);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;

  return parsed;
}

async function assertStorageLocation(id: number | null | undefined) {
  if (id === undefined || id === null) return;

  const location = await prisma.storageLocation.findUnique({
    where: { id },
  });

  if (!location) {
    throw new StorageLocationNotFoundError();
  }
}
