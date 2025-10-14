import { ConsumoEnergia } from '../../domain/ConsumoEnergia';
import type { ConsumoEnergiaApplicationService } from '../../application/ConsumoEnergiaApplicationService';
import { Request, Response } from 'express';
import { error } from 'console';





export class ConsumoEnergiaController {
    private app: ConsumoEnergiaApplicationService;

    constructor(app: ConsumoEnergiaApplicationService) {
        this.app = app;
    }

    async createConsumoEnergia(req: Request, res: Response) {
        const { apartament_id, consumo_kwh, cost, fecha_lectura, mes_facturacion, consumo_mensual, notas } = req.body;
        try {
            // Validar con regex
            const ConsumoEnergiaRegex = /^[a-zA-Z0-9\s.,'-]*$/;
            if (!ConsumoEnergiaRegex.test(apartament_id.trim())) {
                return res
                .status(400)
                .json({ message: "ID de apartamento contiene caracteres inválidos" });
            }

            if(!/^\d+$/.test(consumo_kwh)){
                return res
                .status(400)
                .json({ message: "Consumo kWh debe ser un número válido" });
            }

            if(!/^\d+(\.\d{1,2})?$/.test(cost)){
                return res
                .status(400)
                .json({ message: "Costo debe ser un número válido con hasta dos decimales" });
            }

            if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_lectura)) {
                return res
                .status(400)
                .json({ message: "Fecha de lectura debe tener el formato YYYY-MM-DD" });
            }

            if (!/^\d{4}-\d{2}$/.test(mes_facturacion)) {
                return res
                .status(400)
                .json({ message: "Mes de facturación debe tener el formato YYYY-MM" });
            }

            if(!/^\d+$/.test(consumo_mensual)){
                return res
                .status(400)
                .json({ message: "Consumo mensual debe ser un número válido" });
            }

            if (notas && !ConsumoEnergiaRegex.test(notas.trim())) {
                return res
                .status(400)
                .json({ message: "Notas contiene caracteres inválidos" });
            }

            const newConsumoEnergia: Omit<ConsumoEnergia, 'id'> = {
                apartament_id,
                consumo_kwh,
                cost,
                fecha_lectura,
                mes_facturacion,
                consumo_mensual,
                notas
            };
            const ConsumoEnergia = await this.app.createConsumoEnergia(newConsumoEnergia);
            return res.status(201).json({ id: ConsumoEnergia, message: 'Consumo de energía creado exitosamente' });
            
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500)
                .json({ error: "error en el servidor",
                    details: error.message });
            }
            return res.status(500).json({ error: "error en el servidor" });
        }
    }

    async getConsumoEnergiaById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) 
                return res.status(400).json({ message: "el id debe ser un número" });
            const consumoEnergia = await this.app.getConsumoEnergiaById(id);
            if(!consumoEnergia) return res.status(404).json({ message: "Consumo de energía no encontrado" });
            return res.status(200).json(consumoEnergia);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500)
                .json({ error: "error en el servidor",
                    details: error.message });
            }
            return res.status(500).json({ error: "error en el servidor" });
        }
    }

    async getConsumoEnergiaByApartamentId(req: Request, res: Response) {
        try {
            const apartament_id = req.params.apartament_id;
            if(!/^[a-zA-Z0-9\s.,'-]*$/.test(apartament_id.trim())) 
                return res
                .status(400)
                .json({ message: "ID de apartamento contiene caracteres inválidos" });
                // Validar que el apartamento exista
            const consumoEnergia = await this.app.getConsumoEnergiaById(apartament_id);
            if(consumoEnergia.length === 0) return res.status(404).json({ message: "No se encontraron consumos de energía para este apartamento" });
            return res.status(200).json(consumoEnergia);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500)
                .json({ error: "error en el servidor",
                    details: error.message });
            }
            return res.status(500).json({ error: "error en el servidor" });
        }
    }

    async getAllConsumoEnergias(req: Request, res: Response): Promise<Response> {
        try {
            const consumoEnergias = await this.app.getAllConsumoEnergia();
            if(consumoEnergias.length === 0) return res.status(404).json({ message: "No se encontraron consumos de energía" });
            return res.status(200).json(consumoEnergias);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500)
                .json({ error: "error en el servidor",
                    details: error.message });
            }
            return res.status(500).json({ error: "error en el servidor" });
        }
    }

    async deleteConsumoEnergia(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) 
                return res
            .status(400)
            .json({ error: "el id debe ser un número" });

            const deleted = await this.app.deleteConsumoEnergia(id);
            if (!deleted) 
                return res
            .status(404)
            .json({ message: "Consumo de energía no encontrado" });
            return res.status(200).json({ message: "Consumo de energía eliminado" });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500)
                .json({ error: "error en el servidor",
                    details: error.message });
            }
            return res.status(500).json({ error: "error en el servidor" });
        }
    }

    async updateConsumoEnergia(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) 
                return res
            .status(400)
            .json({ error: "el id debe ser un número" });

            const { apartament_id, consumo_kwh, cost, fecha_lectura, mes_facturacion, consumo_mensual, notas } = req.body;

            // Validar antes de actualizar
            if (apartament_id && !/^[a-zA-Z0-9\s.,'-]*$/.test(apartament_id.trim())) {
                return res
                .status(400)
                .json({ message: "ID de apartamento contiene caracteres inválidos" });
            }

            if (consumo_kwh && !/^\d+$/.test(consumo_kwh)) {
                return res
                .status(400)
                .json({ message: "Consumo kWh debe ser un número válido" });
            }

            if (cost && !/^\d+(\.\d{1,2})?$/.test(cost)) {
                return res
                .status(400)
                .json({ message: "Costo debe ser un número válido con hasta dos decimales" });
            }

            if (fecha_lectura && !/^\d{4}-\d{2}-\d{2}$/.test(fecha_lectura)) {
                return res
                .status(400)
                .json({ message: "Fecha de lectura debe tener el formato YYYY-MM-DD" });
            }

            if (mes_facturacion && !/^\d{4}-\d{2}$/.test(mes_facturacion)) {
                return res
                .status(400)
                .json({ message: "Mes de facturación debe tener el formato YYYY-MM" });
            }

            if (consumo_mensual && !/^\d+$/.test(consumo_mensual)) {
                return res
                .status(400)
                .json({ message: "Consumo mensual debe ser un número válido" });
            }

            if (notas && !/^[a-zA-Z0-9\s.,'-]*$/.test(notas.trim())) {
                return res
                .status(400)
                .json({ message: "Notas contiene caracteres inválidos" });
            }

            const updatedConsumo: Partial<ConsumoEnergia> = {
                apartament_id,
                consumo_kwh,
                cost,
                fecha_lectura,
                mes_facturacion,
                consumo_mensual,
                notas
            };

            const updated = await this.app.updateConsumoEnergia(id, updatedConsumo);
            if (!updated) 
                return res
            .status(404)
            .json({ message: "Consumo de energía no encontrado" });
            return res.status(200).json({ message: "Consumo de energía actualizado" });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500)
                .json({ error: "error en el servidor",
                    details: error.message });
            }
            return res.status(500).json({ error: "error en el servidor" });
        }
    }
}

