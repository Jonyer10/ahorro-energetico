import { SolicitudServicio } from "./SolicitudServicio";

export interface SolicitudServicioPort{
    createSolicitudServicio(request: Omit<SolicitudServicio, "id" | "create_at" | "update_at">): Promise <number>;
    getSolicitudServiceById(id:number): Promise <SolicitudServicio | null>;
    getSolicitudServicioByAparamentId(apartament_id: number): Promise<SolicitudServicio []>;
    getSolicitudServicioByStatus(status: string): Promise <SolicitudServicio[]>;
    getSolicitudServicioByType(tipo_solicitud: string): Promise <SolicitudServicio[]>;
    getAllSolicitudServicio(): Promise <SolicitudServicio[]>;
    updateSolicitudServicio(id: number, request: Partial <SolicitudServicio>): Promise<boolean>;
    deleteSolicitudServicio(id: number): Promise<boolean>;
    assignSolicitudServicio(id: number, assigned_to: string): Promise<boolean>;
    resolveSolicitudServicio(id:number, resolucion_notes:string): Promise<boolean>;
}