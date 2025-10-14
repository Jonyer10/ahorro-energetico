import  { Request, Response } from "express";
import { Apartament } from "../../domain/Apartament";
import type { ApartamentApplicationService } from "../../application/ApartamentsApplicationService";


export class ApartamentsController {
    private app: ApartamentApplicationService;

    constructor(app: ApartamentApplicationService) {
        this.app = app;
    }

    async createApartament(req: Request, res: Response) {
        const { apartament_number, torre, piso, user_id, status } = req.body;
        try {
            //validaciones con regexserId
            const apartamentNumberRegex = /^[A-Za-z0-9\-]+$/;
            if (apartamentNumberRegex.test(apartament_number.trim()))
                return res
            .status(400)
            .json({ message: "Número de apartamento inválido. Solo se permiten letras, números y guiones." });

            if (!torre || typeof torre !== "string" || torre.trim().length === 0)
                return res
            .status(400)
            .json({ message: "Torre inválida. Debe ser una cadena no vacía." });

            if (!Number.isInteger(piso) || piso < 0)
                return res
            .status(400)
            .json({ message: "Piso inválido. Debe ser un número entero no negativo." });

            if (!Number.isInteger(user_id) || user_id <= 0)
                return res
            .status(400)
            .json({ message: "ID de usuario inválido. Debe ser un número entero positivo." });

            if (status !== "active" && status !== "inactive")
                return res
            .status(400)
            .json({ message: "Estado inválido. Debe ser 'active' o 'inactive'." });

            const apartament: Omit<Apartament, "id"> = { apartament_number, torre, piso, user_id, status };

            const apartamentId = await this.app.createApartament(apartament);
            return res.status(201).json({ message: "Apartamento creado con éxito", apartamentId });

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
    async getApartamentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const apartament = await this.app.getApartamentById(id);
            if (!apartament) {
                return res.status(404).json({ message: "Apartamento no encontrado" });
            }
            return res.status(200).json(apartament);
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

    async getAllApartaments(req: Request, res: Response) {
        try {
            const apartaments = await this.app.getAllApartaments();
            return res.status(200).json(apartaments);
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
    async deleteApartament(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            if (isNaN(id)) return res.status(400).json({ message: "El ID debe ser un número  o ID Invalido" });
            const deleted = await this.app.deleteApartament(id);
            if (!deleted) return res.status(404).json({ message: "Apartamento no encontrado" });
            return res.status(200).json({ message: "Apartamento eliminado con éxito" });
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
    async updateApartament(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            if (isNaN(id)) return res.status(400).json({ message: "El ID debe ser un número  o ID Invalido" });
            const { apartament_number, torre, piso, user_id, status } = req.body;
            const apartament: Partial<Apartament> = {};
            if (apartament_number !== undefined) {
                const apartamentNumberRegex = /^[A-Za-z0-9\-]+$/;
                if (!apartamentNumberRegex.test(apartament_number.trim()))
                    return res
                .status(400)
                .json({ message: "Número de apartamento inválido. Solo se permiten letras, números y guiones." });
                apartament.apartament_number = apartament_number;
            }
            if (torre !== undefined) {
                if (!torre || typeof torre !== "string" || torre.trim().length === 0)
                    return res
                .status(400)
                .json({ message: "Torre inválida. Debe ser una cadena no vacía." });
                apartament.torre = torre;
            }

            if (piso !== undefined) {
                if (!Number.isInteger(piso) || piso < 0)
                    return res
                .status(400)
                .json({ message: "Piso inválido. Debe ser un número entero no negativo." });
                apartament.piso = piso;
            }

            if (user_id !== undefined) {
                if (!Number.isInteger(user_id) || user_id < 0)
                    return res
                .status(400)
                .json({ message: "ID de usuario inválido. Debe ser un número entero no negativo." });
                apartament.user_id = user_id;
            }

            if (status !== undefined) {
                if (typeof status !== "string" || status.trim().length === 0)
                    return res
                .status(400)
                .json({ message: "Estado inválido. Debe ser una cadena no vacía." });
                apartament.status = status;
            }

            const updated = await this.app.updateApartament(id, apartament);
            if (!updated) return res.status(404).json({ message: "Apartamento no encontrado" });
            return res.status(200).json({ message: "Apartamento actualizado con éxito" });
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
    async getApartamentByNumber(req: Request, res: Response) {
        try {
            const apartament_number = typeof req.params.apartament_number === "number" ? req.params.apartament_number : 0;
            const apartament = await this.app.getApartamentById(apartament_number);
            if (!apartament) return res.status(404).json({ message: "Apartamento no encontrado" });
            return res.status(200).json(apartament);
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
    async getApartamentByUserId(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId ?? "");
            if (isNaN(userId)) return res.status(400).json({ message: "El ID de usuario debe ser un número" });
            const apartament = await this.app.getApartamentById(userId);
            if (!apartament) return res.status(404).json({ message: "Apartamento no encontrado" });
            return res.status(200).json(apartament);
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

