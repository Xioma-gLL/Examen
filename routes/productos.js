import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = Router();

const isObjectIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

const getValidationResponse = (error) => {
    if (error.name === "ValidationError") {
        return {
            status: 400,
            payload: {
                ok: false,
                message: "Error de validacion",
                errors: Object.values(error.errors).map((item) => item.message),
            },
        };
    }

    if (error.name === "CastError") {
        return {
            status: 400,
            payload: {
                ok: false,
                message: "Formato de dato invalido",
            },
        };
    }

    return null;
};

router.post("/", async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria } = req.body;

        const producto = await Product.create({
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
        });

        return res.status(201).json({
            ok: true,
            message: "Producto creado correctamente",
            data: producto,
        });
    } catch (error) {
        const validation = getValidationResponse(error);
        if (validation) {
            return res.status(validation.status).json(validation.payload);
        }

        console.error("Error creating product:", error);
        return res.status(500).json({
            ok: false,
            message: "No se pudo crear el producto",
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const productos = await Product.find().sort({ createdAt: -1 });

        return res.status(200).json({
            ok: true,
            count: productos.length,
            data: productos,
        });
    } catch (error) {
        console.error("Error getting products:", error);
        return res.status(500).json({
            ok: false,
            message: "No se pudieron listar los productos",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isObjectIdValid(id)) {
            return res.status(400).json({
                ok: false,
                message: "ID de producto invalido",
            });
        }

        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: "Producto no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            data: producto,
        });
    } catch (error) {
        console.error("Error getting product by id:", error);
        return res.status(500).json({
            ok: false,
            message: "No se pudo obtener el producto",
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isObjectIdValid(id)) {
            return res.status(400).json({
                ok: false,
                message: "ID de producto invalido",
            });
        }

        const { nombre, descripcion, precio, stock, categoria } = req.body;

        const productoActualizado = await Product.findByIdAndUpdate(
            id,
            {
                nombre,
                descripcion,
                precio,
                stock,
                categoria,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!productoActualizado) {
            return res.status(404).json({
                ok: false,
                message: "Producto no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Producto actualizado correctamente",
            data: productoActualizado,
        });
    } catch (error) {
        const validation = getValidationResponse(error);
        if (validation) {
            return res.status(validation.status).json(validation.payload);
        }

        console.error("Error updating product:", error);
        return res.status(500).json({
            ok: false,
            message: "No se pudo actualizar el producto",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isObjectIdValid(id)) {
            return res.status(400).json({
                ok: false,
                message: "ID de producto invalido",
            });
        }

        const productoEliminado = await Product.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({
                ok: false,
                message: "Producto no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Producto eliminado correctamente",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            ok: false,
            message: "No se pudo eliminar el producto",
        });
    }
});

export default router;
