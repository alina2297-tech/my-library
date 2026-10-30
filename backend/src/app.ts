import express from "express";
import cors from "cors";
import path from "node:path";
import { handleUploadError } from "./middleware/upload";
import storageRoutes from "./routes/storage.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/storage", storageRoutes);
app.use(handleUploadError);

export default app;
