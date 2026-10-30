import { Router } from "express";
import * as storageController from "../controllers/storage.controller";
import { uploadStoragePhoto } from "../middleware/upload";

const router = Router();

router.get("/", storageController.getStorageLocations);
router.get("/:id", storageController.getStorageLocationById);
router.post("/", uploadStoragePhoto, storageController.createStorageLocation);
router.put("/:id", uploadStoragePhoto, storageController.updateStorageLocation);
router.delete("/:id", storageController.deleteStorageLocation);

export default router;
