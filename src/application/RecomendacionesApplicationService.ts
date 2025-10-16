import { Recomendaciones } from "../domain/Recomendaciones";
import { RecomendacionesPort } from "../domain/RecomendacionesPort";



export class RecomendacionesApplicationService {
    getRecomendacionesByApartamentId(apartamentId: number) {
        throw new Error('Method not implemented.');
    }
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

    async getRecomendacionesByStatus(apartament_id: number, status: string): Promise<Recomendaciones[]> {
        return await this.port.getRecomendacionesByStatus(apartament_id, status);
    }

    async getRecomendacionesByCategory(apartament_id: number, categoria: string): Promise<Recomendaciones[]> {
        return await this.port.getRecomendacionesByCategory(apartament_id, categoria);
    }

    async updateRecomendaciones(id: number, recomendaciones: Partial<Recomendaciones>): Promise<boolean> {
       // Validar si la recomendacion existe
        const existingRecomendaciones = await this.port.getRecomendaciones(id);
        if (!existingRecomendaciones) {
            throw new Error("Recomendacion no encontrada");
        }
        if (recomendaciones.apartament_id && recomendaciones.title ){  
            const recomendacionesTaken = await this.port.getRecomendacionesByApartamentId(recomendaciones.apartament_id);
            if (Array.isArray(recomendacionesTaken) && recomendacionesTaken.some(rec => rec.id !== id && rec.title === recomendaciones.title)) {
                throw new Error("Recomendacion ya existe con este titulo");
            }
            return this.port.updateRecomendaciones(id, recomendaciones);
        }
        // Si no se cumplen las condiciones anteriores, retornar false
        return false;
    }

    async deleteRecomendaciones(id: number): Promise<boolean> {
        const existingRecomendaciones = await this.port.getRecomendaciones(id);
        if (!existingRecomendaciones) {
            throw new Error("Recomendacion no encontrada");
        }
        return await this.port.deleteRecomendaciones(id);
    }
}
