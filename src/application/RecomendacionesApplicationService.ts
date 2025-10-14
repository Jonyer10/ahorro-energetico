import { Recomendaciones } from "../domain/Recomendaciones";
import { RecomendacionesPort } from "../domain/RecomendacionesPort";



export class RecomendacionesApplicationService {
    private port: RecomendacionesPort;

    constructor(port: RecomendacionesPort) {
        this.port = port;
    }

    async createRecomendaciones(recomendaciones: Omit<Recomendaciones, "id">): Promise<number> {
        // se hacen validaciones de negocio
        const existingRecomendaciones = await this.port.getRecomendacionesByApartamentId(recomendaciones.apartament_id);
        if (existingRecomendaciones) {
            throw new Error("Recomendacion ya existe con este titulo");
        }
        return this.port.createRecomendaciones(recomendaciones);
    }

    async getRecomendacionesById(id: number): Promise<Recomendaciones | null> {
        return await this.port.getRecomendaciones(id);
    }

    async getAllRecomendaciones(): Promise<Recomendaciones[]> {
        return await this.port.getAllRecomendaciones();
    }

    async updateRecomendaciones(id: number, recomendaciones: Partial<Recomendaciones>): Promise<boolean> {
       // Validar si la recomendacion existe
        const existingRecomendaciones = await this.port.getRecomendaciones(id);
        if (!existingRecomendaciones) {
            throw new Error("Recomendacion no encontrada");
        }
        if (recomendaciones.apartament_id && recomendaciones.title ){  
            const recomendacionesTaken = await this.port.getRecomendacionesByApartamentId(recomendaciones.apartament_id);
            if (recomendacionesTaken && recomendacionesTaken.some(rec => rec.id !== id && rec.title === recomendaciones.title)) {
                throw new Error("Recomendacion ya existe con este titulo");
            }
        return this.port.updateRecomendaciones(id, recomendaciones);
    }
    }

    async deleteRecomendaciones(id: number): Promise<boolean> {
        const existingRecomendaciones = await this.port.getRecomendaciones(id);
        if (!existingRecomendaciones) {
            throw new Error("Recomendacion no encontrada");
        }
        return await this.port.deleteRecomendaciones(id);
    }
}
