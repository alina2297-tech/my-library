import { Router } from "express";
import * as storageController from "../controllers/storage.controller";

const router = Router();

router.get("/", storageController.getStorageLocations);
router.get("/:id", storageController.getStorageLocationById);
router.post("/", storageController.createStorageLocation);
router.put("/:id", storageController.updateStorageLocation);
router.delete("/:id", storageController.deleteStorageLocation);

export default router;
