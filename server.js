import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectToDB from "./database/db.js";
import productosRouter from "./routes/productos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
    res.status(200).json({ ok: true, message: "API activa" });
});

app.use("/productos", productosRouter);

app.use((req, res) => {
    res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);
    res.status(500).json({ ok: false, message: "Error interno del servidor" });
});

connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});