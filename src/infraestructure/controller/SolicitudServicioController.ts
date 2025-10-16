import { Request, Response } from "express";
import { SolicitudServicioApplicationService } from "../../application/SolicitudServicioApplicationService";
import { SolicitudServicio } from "../../domain/SolicitudServicio";



export class SolicitudServicioController {
    private app: SolicitudServicioApplicationService;

    constructor(app: SolicitudServicioApplicationService) {
        this.app = app;
    }

    async createSolicitudServicio(req: Request, res: Response) {
        //logica para crear una solicitud de servicio
        const { apartament_id, tipo_solicitud, title, 
            prioridad, assigned_to, 
            resolucion_notes } = req.body;
        try {
            // Validaciones con regex
            const apartament_idRegex = /^[0-9]+$/;
            if (!apartament_id || !apartament_idRegex.test(apartament_id.toString()))
                return res.status(400).json({ message: "El apartament_id es obligatorio y debe ser un número." });

            if(!/^(mantenimiento|reparacion|consulta)$/.test(tipo_solicitud))
                return res.status(400).json({ message: "El tipo de solicitud debe ser 'mantenimiento', 'reparacion' o 'consulta'." });

            if(!/^(baja|media|alta)$/.test(prioridad))
                return res.status(400).json({ message: "La prioridad debe ser 'baja', 'media' o 'alta'." });

            if(!/^[a-zA-Z0-9\s\zÑñÁáÉéÍíÓóÚúÜü]+$/.test(title.trim()))
                return res.status(400).json({ message: "El título solo debe contener letras, números y espacios." });

            if(assigned_to && !/^[a-zA-Z\s\zÑñÁáÉéÍíÓóÚúÜü]+$/.test(assigned_to.trim()))
                return res.status(400).json({ message: "El campo 'assigned_to' solo debe contener letras y espacios." });

            if(resolucion_notes && !/^[a-zA-Z0-9\s\zÑñÁáÉéÍíÓóÚúÜü.,!?'-]+$/.test(resolucion_notes.trim()))
                return res.status(400).json({ message: "El campo 'resolucion_notes' contiene caracteres inválidos." });

            const status = "pendiente"; // Estado por defecto al crear una solicitud de servicio
            const solicitudServicio: Omit<SolicitudServicio, "id"> = {
                apartament_id,
                tipo_solicitud,
                title,
                prioridad,
                status,
                assigned_to,
                resolucion_notes,
                create_at: new Date(),
                update_at: new Date()
            };

            const solicitudServicioId = await this.app.createSolicitudServicio(solicitudServicio);
            return res.status(201).json({ message: "Solicitud de servicio creada con éxito", solicitudServicioId });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).
                    json({
                        error: "Error del servidor",
                        details: error.message
                    });
            }

            return res.status(500).
                json({
                    error: "Error del servidor"
                });
        }

    }
    async getSolicitudServicioById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            if (isNaN(id)) return res.status(400).json({ message: "El ID debe ser un número o ID Invalido" });
            const solicitudServicio = await this.app.getSolicitudServicioById(id);
            if (!solicitudServicio) return res.status(404).json({ message: "Solicitud de servicio no encontrada" });
            return res.status(200).json(solicitudServicio);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }

            return res.status(500).json({
                error: "Error del servidor"
            });
        }

    }
    async getSolicitudServicioByApartamentId(req: Request, res: Response) {
        try {
            const apartament_id = parseInt(req.params.apartament_id ?? "");
            if (isNaN(apartament_id)) return res.status(400).json({ message: "El apartament_id debe ser un número o ID Invalido" });
            const solicitudServicio = await this.app.getSolicitudServicioByApartamentId(apartament_id);
            if (!solicitudServicio) return res.status(404).json({ message: "Solicitud de servicio no encontrada" });
            return res.status(200).json(solicitudServicio);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }

            return res.status(500).json({
                error: "Error del servidor"
            });
        }

    }

    async getAllSolicitudServicio(req: Request, res: Response) {
        try {
            const solicitudServicios = await this.app.getAllSolicitudServicio();
            return res.status(200).json(solicitudServicios);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }

            return res.status(500).json({
                error: "Error del servidor"
            });
        }

    }
    async getSolicitudServicioByStatus(req: Request, res: Response) {
        try {
            const status = typeof req.params.status === "string" ? req.params.status : "";
            if (!status || !/^(pendiente|en progreso|resuelto)$/.test(status))
                return res.status(400).json({ message: "El estado debe ser 'pendiente', 'en progreso' o 'resuelto'." });
            const solicitudServicios = await this.app.getSolicitudServicioByStatus(status);
            return res.status(200).json(solicitudServicios);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }

            return res.status(500).json({
                error: "Error del servidor"
            });
        }

    }

    async getSolicitudServicioByType(req: Request, res: Response) {
        try {
            const tipo_solicitud = typeof req.params.tipo_solicitud === "string" ? req.params.tipo_solicitud : "";
            if (!tipo_solicitud) return res.status(400).json({ message: "El tipo de solicitud es requerido." });
            const solicitudServicios = await this.app.getSolicitudServicioByType(tipo_solicitud);
            return res.status(200).json(solicitudServicios);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }

            return res.status(500).json({
                error: "Error del servidor"
            });
        }

    }

    async assignSolicitudServicio(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            const { assigned_to } = req.body;
            if (isNaN(id)) return res.status(400).json({ message: "El ID debe ser un número o ID Invalido" });
            if (!assigned_to || !/^[a-zA-Z\s\zÑñÁáÉéÍíÓóÚúÜü]+$/.test(assigned_to.trim()))
                return res.status(400).json({ message: "El campo 'assigned_to' es obligatorio y solo debe contener letras y espacios." });
            const success = await this.app.assignSolicitudServicio(id, assigned_to);
            if (!success) return res.status(404).json({ message: "Solicitud de servicio no encontrada" });
            return res.status(200).json({ message: "Solicitud de servicio asignada con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }

            return res.status(500).json({
                error: "Error del servidor"
            });
        }
    }

    async resolveSolicitudServicio(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            const { resolucion_notes } = req.body;
            if (isNaN(id)) return res.status(400).json({ message: "El ID debe ser un número o ID Invalido" });
            if (!resolucion_notes || !/^[a-zA-Z0-9\s\zÑñÁáÉéÍíÓóÚúÜü.,!?'-]+$/.test(resolucion_notes.trim()))
                return res.status(400).json({ message: "El campo 'resolucion_notes' es obligatorio y contiene caracteres inválidos." });
            const success = await this.app.resolveSolicitudServicio(id, resolucion_notes);
            if (!success) return res.status(404).json({ message: "Solicitud de servicio no encontrada" });
            return res.status(200).json({ message: "Solicitud de servicio resuelta con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }

            return res.status(500).json({
                error: "Error del servidor"
            });
        }
    }

    async updateSolicitudServicio(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número o ID Invalido" });

            let { apartament_id, tipo_solicitud, title, prioridad, status, assigned_to, resolucion_notes } = req.body;

            //Validaciones antes de actualizar
            if (apartament_id && !/^[0-9]+$/.test(apartament_id.trim()))
                return res
            .status(400)
            .json({ error: 
                "El apartament_id debe ser un número." 
            });

            if (tipo_solicitud && !/^(mantenimiento|reparacion|consulta)$/.test(tipo_solicitud))
                return res
                    .status(400)
                    .json({ error: "El tipo de solicitud debe ser 'mantenimiento', 'reparacion' o 'consulta'." });

            if (prioridad && !/^(baja|media|alta)$/.test(prioridad))
                return res
                    .status(400)
                    .json({ error: "La prioridad debe ser 'baja', 'media' o 'alta'." });

            if (status && !/^(pendiente|en progreso|resuelto)$/.test(status))
                return res
                    .status(400)
                    .json({ error: "El estado debe ser 'pendiente', 'en progreso' o 'resuelto'." });
        
            if (title && !/^[a-zA-Z0-9\s\zÑñÁáÉéÍíÓóÚúÜü]+$/.test(title.trim()))
                return res
                    .status(400)
                    .json({ error: "El título solo debe contener letras, números y espacios." });

            if (assigned_to && !/^[a-zA-Z\s\zÑñÁáÉéÍíÓóÚúÜü]+$/.test(assigned_to.trim()))
                return res
                    .status(400)
                    .json({ error: "El campo 'assigned_to' solo debe contener letras y espacios." });

            if (resolucion_notes && !/^[a-zA-Z0-9\s\zÑñÁáÉéÍíÓóÚúÜü.,!?'-]+$/.test(resolucion_notes.trim()))
                return res
                    .status(400)
                    .json({ error: "El campo 'resolucion_notes' contiene caracteres inválidos." });

            status = 1;

            const updated = await this.app.updateSolicitudServicio(id, {
                apartament_id,
                tipo_solicitud,
                title,
                prioridad,
                status,
                assigned_to,
                resolucion_notes
            });
            if (!updated) 
                return res
            .status(404)
            .json({ message: 
                "Solicitud de servicio no encontrada" });

            return res
                .status(200)
                .json({ error: "Solicitud de servicio actualizada con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }
            return res.status(500).json({
                error: "Error del servidor"
            });
        }
    }

    async deleteSolicitudServicio(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            if (isNaN(id)) return res
            .status(400)
            .json({ error: 
                "El ID debe ser un número o ID Invalido" });
    
            const deleted = await this.app.deleteSolicitudServicio(id);
            if (!deleted) {return res
            .status(404)
            .json({ error: 
                "Solicitud de servicio no encontrada" });
            }
            return res
            .status(200)
            .json({ message: 
                "Solicitud de servicio eliminada con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }
            return res.status(500).json({
                error: "Error del servidor"
            });
        }
    }

}