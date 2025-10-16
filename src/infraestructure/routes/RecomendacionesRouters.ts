import { Router } from "express";
import { RecomendacionesAdapter } from "../adapter/RecomendacionesAdapter.ts";
import { RecomendacionesApplicationService } from "../../application/RecomendacionesApplicationService.ts";
import { RecomendacionesController } from "../controller/RecomendacionesController.ts";

const router = Router();

// Crear instancias de los adaptadores, servicios y controladores
const recomendacionesAdapter = new RecomendacionesAdapter();
const recomendacionesApplicationService = new RecomendacionesApplicationService(recomendacionesAdapter);
const recomendacionesController = new RecomendacionesController(recomendacionesApplicationService);

//definir las rutas y asociarlas con los métodos del controlador
router.post("/recomendaciones", async (req, res) =>{
    try {
        await recomendacionesController.createRecomendaciones(req, res);

    } catch (error) {
        res.status(500).json({message: "Error creando la recomendacion", error});
    }
});

router.get("/recomendaciones", async (req, res) =>{
    try {
        await recomendacionesController.getAllRecomendaciones(req, res);
    } catch (error) {
        res.status(500).json({message: "Error obteniendo las recomendaciones", error});
    }
});

router.get("/recomendaciones/:id", async (req, res) =>{
    try {
        await recomendacionesController.getRecomendacionesById(req, res);
    } catch (error) {
        res.status(500).json({message: "Error obteniendo la recomendacion", error});
    }
});

router.get("/recomendaciones/apartamento/:apartament_id", async (req, res) =>{
    try {
        await recomendacionesController.getRecomendacionesByApartamentId(req, res);
    } catch (error) {
        res.status(500).json({message: "Error obteniendo las recomendaciones del apartamento", error});
    }
});

router.get("/recomendaciones/apartamento/:apartament_id/status/:status", async (req, res) =>{
    try {
        await recomendacionesController.getRecomendacionesByStatus(req, res);
    } catch (error) {
        res.status(500).json({message: "Error obteniendo las recomendaciones del apartamento por estado", error});
    }
});

router.get("/racomendaciones/apartamento/:apartament_id/status/:status", async (req, res) =>{
    try {
        await recomendacionesController.getRecomendacionesById(req, res);
    } catch (error) {
        res.status(500).json({message: "Error obteniendo las recomendaciones del apartamento por estado", error});
    }
});

router.get("/recomendaciones/categoria/:categoria", async (req, res) =>{
    try {
        await recomendacionesController.getRecomendacionesByCategory(req, res);
    } catch (error) {
        res.status(500).json({message: "Error obteniendo las recomendaciones por categoria", error});
    }
});

router.put("/recomendaciones/:id", async (req, res) =>{
    try {
        await recomendacionesController.updateRecomendaciones(req, res);
    } catch (error) {
        res.status(500).json({message: "Error actualizando la recomendacion", error});
    }
});

router.delete("/recomendaciones/:id", async (req, res) =>{
    try {
        await recomendacionesController.deleteRecomendaciones(req, res);
    } catch (error) {
        res.status(500).json({message: "Error eliminando la recomendacion", error});
    }
});

export default router;