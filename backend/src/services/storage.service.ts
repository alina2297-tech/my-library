import { deleteStoragePhoto } from "../lib/storagePhotos";
import { prisma } from "../lib/prisma";

export const getStorageLocations = () => {
  return prisma.storageLocation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getStorageLocationById = (id: string) => {
  return prisma.storageLocation.findUnique({
    where: { id: parseInt(id, 10) },
  });
};

export const createStorageLocation = (data: {
  title: string;
  description?: string;
  address?: string;
  photo?: string;
}) => {
  return prisma.storageLocation.create({ data });
};

export const updateStorageLocation = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    address?: string;
    photo?: string;
  }
) => {
  const existing = await getStorageLocationById(id);
  if (!existing) return null;

  const location = await prisma.storageLocation.update({
    where: { id: parseInt(id, 10) },
    data,
  });

  if (data.photo && existing.photo && existing.photo !== data.photo) {
    await deleteStoragePhoto(existing.photo);
  }

  return location;
};

export const deleteStorageLocation = async (id: string) => {
  const existing = await getStorageLocationById(id);
  if (!existing) return null;

  const location = await prisma.storageLocation.delete({
    where: { id: parseInt(id, 10) },
  });

  await deleteStoragePhoto(existing.photo);

  return location;
};
