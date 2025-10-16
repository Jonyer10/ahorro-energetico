import { RecomendacionesApplicationService } from '../../application/RecomendacionesApplicationService';
import { Recomendaciones } from '../../domain/Recomendaciones';
import type { Request, Response } from 'express';



export class RecomendacionesController { 
    private app: RecomendacionesApplicationService;

    constructor(app: RecomendacionesApplicationService) {
        this.app = app;
    }

    async createRecomendaciones(req: Request, res: Response) {
        // logica para manejar la creación de una recomendacion
        const { apartament_id, title, descripcion, 
            categoria, prioridad, ahorro_estimado, 
            costo_ahorro_estimado } = req.body;
        try {
            //validaciones con regex
            const titleRegex = /^[a-zA-Z0-9\s,.!?'-]{5,100}$/;
            if (!title || !titleRegex.test(title.trim()))
                return res
            .status(400)
            .json({ message: "Título inválido. Debe tener entre 5 y 100 caracteres y solo puede contener letras, números y signos de puntuación básicos." });

            const descripcionRegex = /^[a-zA-Z0-9\s,.!?'-]{10,500}$/;
            if (!descripcion || !descripcionRegex.test(descripcion.trim()))
                return res
            .status(400)
            .json({ message: "Descripción inválida. Debe tener entre 10 y 500 caracteres y solo puede contener letras, números y signos de puntuación básicos." });

            const categoriaRegex = /^[a-zA-Z\s]{3,50}$/;
            if (!categoria || !categoriaRegex.test(categoria.trim()))
                return res
            .status(400)
            .json({ message: "Categoría inválida. Debe tener entre 3 y 50 caracteres y solo puede contener letras y espacios." });

            const prioridadRegex = /^(baja|media|alta)$/i;
            if (!prioridad || !prioridadRegex.test(prioridad.trim()))
                return res
            .status(400)
            .json({ message: "Prioridad inválida. Debe ser 'baja', 'media' o 'alta'." });

            if (isNaN(ahorro_estimado) || ahorro_estimado < 0)
                return res
            .status(400)
            .json({ message: "Ahorro estimado inválido. Debe ser un número positivo." });

            if (isNaN(costo_ahorro_estimado) || costo_ahorro_estimado < 0)
                return res
            .status(400)
            .json({ message: "Costo de ahorro estimado inválido. Debe ser un número positivo." });

            const Recomendaciones: Omit<Recomendaciones, 'id'> = {
                apartament_id,
                title: title.trim(),
                descripcion: descripcion.trim(),
                categoria: categoria.trim(),
                prioridad: prioridad.trim(),
                ahorro_estimado,
                costo_ahorro_estimado,
                status: '',
                created_at: new Date()
            };
            const createdRecomendacion = await this.app.createRecomendaciones(Recomendaciones);
            return res.status(201)
            .json({ message: 'Recomendación creada exitosamente', createdRecomendacion });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500)
                .json({ 
                    message: "Error en el servidor",
                    details: error.message
                });
            }
            return res.status(500)
            .json({ message: "Error en el servidor" });
        }
    }

    async getRecomendacionesById(req: Request, res: Response) {
        try {
            const Id = parseInt(req.params.id ?? "");
            if (isNaN(Id)) {
                return res.status(400).json({ message: "ID de recomendación inválido" });
            }
            const recomendaciones = await this.app.getRecomendacionesById(Id);
                if (!recomendaciones) {
                    return res.status(404).json({ message: "Recomendación no encontrada" });
                }
                return res.status(200).json(recomendaciones);
            } catch (error) {
                if (error instanceof Error) {
                    return res.status(500)
                    .json({
                        message: "Error en el servidor",
                        details: error.message
                    });
                }
                return res.status(500)
                .json({ message: "Error en el servidor" });
            }
    }
    async getRecomendacionesByApartamentId(req: Request, res: Response) {
        try {
            const apartamentId = req.params.apartament_id;
            if (!apartamentId || !/^\d+$/.test(apartamentId)) {
                return res.status(400).json({ error: "ID de apartamento inválido" });
            }
            // validar que el apartamentId es un número positivo
            const recomendaciones: Recomendaciones[] | null = await (this.app as any).getRecomendacionesByApartamentId(parseInt(apartamentId));
            if (!recomendaciones || recomendaciones.length === 0) {
                return res.status(404).json({ error: "No se encontraron recomendaciones para este apartamento" });
            }
            return res.status(200).json(recomendaciones);

            } catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({
                        error: "Error en el servidor",
                        details: error.message
                    });
                }
                return res.status(500).json({ error: "Error en el servidor" });
            }
    }
        async getRecomendacionesByStatus(req: Request, res: Response) {
        try {
            const apartamentId = req.params.apartament_id;
            const status = req.params.status;
            if (!apartamentId || !/^\d+$/.test(apartamentId)) {
                return res.status(400).json({ error: "ID de apartamento inválido" });
            }
            if (!status || !/^(activo|inactivo)$/i.test(status)) {
                return res.status(400).json({ error: "Estado inválido. Debe ser 'activo' o 'inactivo'." });
            }
            const recomendaciones: Recomendaciones[] | null = await this.app.getRecomendacionesByStatus(parseInt(apartamentId), status);
            if (!recomendaciones || recomendaciones.length === 0) {
                return res.status(404).json({ error: "No se encontraron recomendaciones para este apartamento con el estado especificado" });
            }
            return res.status(200).json(recomendaciones);

            } catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({
                        error: "Error en el servidor",
                        details: error.message
                    });
                }
                return res.status(500).json({ error: "Error en el servidor" });
            }
        }

        async getRecomendacionesByCategory(req: Request, res: Response) {
        try {
            const apartamentId = req.params.apartament_id;
            const categoria = req.params.categoria;

            if (!apartamentId || !/^\d+$/.test(apartamentId)) {
                return res.status(400).json({ error: "ID de apartamento inválido" });
            }
            if (!categoria || !/^[a-zA-Z0-9\s,.!?'-]+$/.test(categoria)) {
                return res.status(400).json({ error: "Categoría inválida" });
            }

            const recomendaciones: Recomendaciones[] | null = await this.app.getRecomendacionesByCategory(parseInt(apartamentId), categoria);
            if (!recomendaciones || recomendaciones.length === 0) {
                return res.status(404).json({ error: "No se encontraron recomendaciones para esta categoría" });
            }
            return res.status(200).json(recomendaciones);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error en el servidor",
                    details: error.message
                });
            }
            return res.status(500).json({ error: "Error en el servidor" });
        }
    }

        async getAllRecomendaciones(req: Request, res: Response) {
        try {
            const recomendaciones = await this.app.getAllRecomendaciones();
            return res.status(200).json(recomendaciones);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    message: "Error en el servidor",
                    details: error.message
                });
            }
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }
    async deleteRecomendaciones(req: Request, res: Response) {
        try {
            const Id = parseInt(req.params.id ?? "");
            if (isNaN(Id)) {
                return res.status(400).json({ message: "ID de recomendación inválido" });
            }
            const deleted = await this.app.deleteRecomendaciones(Id);
            if (!deleted) {
                return res.status(404).json({ message: "Recomendación no encontrada" });
            }
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    message: "Error en el servidor",
                    details: error.message
                });
            }
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }

    async updateRecomendaciones(req: Request, res: Response) {
        try {
            const Id = parseInt(req.params.id ?? "");
            if (isNaN(Id)) {
                return res.status(400).json({ message: "ID de recomendación inválido" });
            }
            const { title, descripcion, categoria, prioridad, ahorro_estimado, costo_ahorro_estimado, status } = req.body;
            //validaciones con regex
            const titleRegex = /^[a-zA-Z0-9\s,.!?'-]{5,100}$/;
            const descripcionRegex = /^[a-zA-Z0-9\s,.!?'-]{10,500}$/;
            const categoriaRegex = /^[a-zA-Z0-9\s,.!?'-]{3,100}$/;
            const prioridadRegex = /^(baja|media|alta)$/;
            const ahorroEstimadoRegex = /^\d+(\.\d{1,2})?$/;
            const costoAhorroEstimadoRegex = /^\d+(\.\d{1,2})?$/;
            const statusRegex = /^(activo|inactivo)$/;
            if (title && !titleRegex.test(title.trim()))
                return res
            .status(400)
            .json({ message: "Título inválido. Debe tener entre 5 y 100 caracteres y solo puede contener letras, números y signos de puntuación básicos." });
            if (descripcion && !descripcionRegex.test(descripcion.trim()))
                return res
            .status(400)
            .json({ message: "Descripción inválida. Debe tener entre 10 y 500 caracteres y solo puede contener letras, números y signos de puntuación básicos." });
            if (categoria && !categoriaRegex.test(categoria.trim()))
                return res
            .status(400)
            .json({ message: "Categoría inválida. Debe tener entre 3 y 100 caracteres y solo puede contener letras, números y signos de puntuación básicos." });
            if (prioridad && !prioridadRegex.test(prioridad.trim()))
                return res
            .status(400)
            .json({ message: "Prioridad inválida. Debe ser 'baja', 'media' o 'alta'." });
            if (ahorro_estimado && !ahorroEstimadoRegex.test(ahorro_estimado.toString()))
                return res
            .status(400)
            .json({ message: "Ahorro estimado inválido. Debe ser un número positivo con hasta dos decimales." });
            if (costo_ahorro_estimado && !costoAhorroEstimadoRegex.test(costo_ahorro_estimado.toString()))
                return res
            .status(400)
            .json({ message: "Costo de ahorro estimado inválido. Debe ser un número positivo con hasta dos decimales." });
            if (status && !statusRegex.test(status.trim()))
                return res
            .status(400)
            .json({ message: "Status inválido. Debe ser 'activo' o 'inactivo'." });
            const recomendacionesData: Partial<Recomendaciones> = {
                ...(title && { title: title.trim() }),
                ...(descripcion && { descripcion: descripcion.trim() }),
                ...(categoria && { categoria: categoria.trim() }),
                ...(prioridad && { prioridad: prioridad.trim() }),
                ...(ahorro_estimado && { ahorro_estimado }),
                ...(costo_ahorro_estimado && { costo_ahorro_estimado }),
                ...(status && { status: status.trim() }),
            };
            const updatedRecomendacion = await this.app.updateRecomendaciones(Id, recomendacionesData);
            if (!updatedRecomendacion) {
                return res.status(404).json({ message: "Recomendación no encontrada" });
            }
            return res.status(200).json({ message: "Recomendación actualizada exitosamente", updatedRecomendacion });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error en el servidor" });
        }
    }
}
