import { SolicitudServicioPort } from "../domain/SolicitudServicioPort";
import { SolicitudServicio } from "../domain/SolicitudServicio";


export class SolicitudServicioApplicationService {
    private port: SolicitudServicioPort;

    constructor(port: SolicitudServicioPort) {
        this.port = port;
    }

    async createSolicitudServicio(solicitudServicio: Omit<SolicitudServicio, "id">): Promise<number> {
        // se hacen validaciones de negocio
        const existingSolicitudServicio = await this.port.getSolicitudServicioByApartamentId(solicitudServicio.apartament_id);
        if (!existingSolicitudServicio){
            return this.port.createSolicitudServicio(solicitudServicio);
        }
        throw new Error("El campo único ya está en uso");
    }

    async getSolicitudServicioById(id: number): Promise<SolicitudServicio | null>{
        return await this.port.getSolicitudServiceById(id);
    }
    
    async getSolicitudServicioByApartamentId(apartamentId: number): Promise<SolicitudServicio[] | null> {
        return await this.port.getSolicitudServicioByApartamentId(apartamentId);
    }

    async getAllSolicitudServicio(): Promise<SolicitudServicio[]> {
        return await this.port.getAllSolicitudServicio();
    }

    async getSolicitudServicioByStatus(status: string): Promise<SolicitudServicio[]> {
        return await this.port.getSolicitudServicioByStatus(status);
    }

    async getSolicitudServicioByType(tipo_solicitud: string): Promise<SolicitudServicio[]> {
        return await this.port.getSolicitudServicioByType(tipo_solicitud);
    }
    async assignSolicitudServicio(id: number, assigned_to: string): Promise<boolean> {
        return await this.port.assignSolicitudServicio(id, assigned_to);
    }

    async resolveSolicitudServicio(id: number, resolucion_notes: string): Promise<boolean> {
        return await this.port.resolveSolicitudServicio(id, resolucion_notes);
    }

    async updateSolicitudServicio(id: number, solicitudServicio: Partial<SolicitudServicio>): Promise<boolean> {
        // Validar si la solicitud de servicio existe
        const existingSolicitudServicio = await this.port.getSolicitudServiceById(id);
        if (!existingSolicitudServicio) {
            throw new Error("La solicitud de servicio no fue encontrada");
        }
        if (solicitudServicio.apartament_id) {
            const apartamentIdTaken = await this.port.getSolicitudServicioByApartamentId(solicitudServicio.apartament_id);
            if (apartamentIdTaken && apartamentIdTaken.some(s => s.id !== id)) {
                throw new Error("El apartament_id ya está en uso");
            }
        }
        return await this.port.updateSolicitudServicio(id, solicitudServicio);
    }

    async deleteSolicitudServicio(id: number): Promise<boolean> {
        // Validar si la solicitud de servicio existe
        const existingSolicitudServicio = await this.port.getSolicitudServiceById(id);
        if (!existingSolicitudServicio) {
            throw new Error("La solicitud de servicio no fue encontrada");
        }
        return await this.port.deleteSolicitudServicio(id);
    }
}