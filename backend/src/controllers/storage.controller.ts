import { Request, Response } from "express";
import { publicPhotoPath } from "../lib/storagePhotos";
import * as storageLocationService from "../services/storage.service";

export const getStorageLocations = async (_req: Request, res: Response) => {
  try {
    const locations = await storageLocationService.getStorageLocations();
    res.json(locations);
  } catch {
    res.status(500).json({
      message: "Failed to get storage locations",
    });
  }
};

export const getStorageLocationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const location = await storageLocationService.getStorageLocationById(id as string);

    if (!location) {
      res.status(404).json({ message: "Storage location not found" });
      return;
    }

    res.json(location);
  } catch {
    res.status(500).json({
      message: "Failed to get storage location",
    });
  }
};

export const createStorageLocation = async (req: Request, res: Response) => {
  try {
    const title = requiredText(req.body.title);
    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const location = await storageLocationService.createStorageLocation({
      title,
      description: optionalText(req.body.description),
      address: optionalText(req.body.address),
      photo: req.file ? publicPhotoPath(req.file.filename) : undefined,
    });

    res.status(201).json(location);
  } catch {
    res.status(500).json({
      message: "Failed to create storage location",
    });
  }
};

export const updateStorageLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const location = await storageLocationService.updateStorageLocation(id as string, {
      title: optionalText(req.body.title),
      description: optionalText(req.body.description),
      address: optionalText(req.body.address),
      photo: req.file ? publicPhotoPath(req.file.filename) : undefined,
    });

    if (!location) {
      res.status(404).json({ message: "Storage location not found" });
      return;
    }

    res.json(location);
  } catch {
    res.status(500).json({
      message: "Failed to update storage location",
    });
  }
};

export const deleteStorageLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const location = await storageLocationService.deleteStorageLocation(id as string);

    if (!location) {
      res.status(404).json({ message: "Storage location not found" });
      return;
    }

    res.json(location);
  } catch {
    res.status(500).json({
      message: "Failed to delete storage location",
    });
  }
};

function requiredText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function optionalText(value: unknown): string | undefined {
  return requiredText(value);
}
