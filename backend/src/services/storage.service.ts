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

export const updateStorageLocation = (
  id: string,
  data: {
    title?: string;
    description?: string;
    address?: string;
    photo?: string;
  }
) => {
  return prisma.storageLocation.update({
    where: { id: parseInt(id, 10) },
    data,
  });
};

export const deleteStorageLocation = (id: string) => {
  return prisma.storageLocation.delete({
    where: { id: parseInt(id, 10) },
  });
};