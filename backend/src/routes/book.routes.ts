import { Router } from "express";
import * as bookController from "../controllers/book.controller";
import { uploadBookPhoto } from "../middleware/upload";

const router = Router();

router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookById);
router.post("/", uploadBookPhoto, bookController.createBook);
router.put("/:id", uploadBookPhoto, bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

export default router;
