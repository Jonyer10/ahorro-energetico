import { date } from "joi";

export interface SolicitudServicio{
    id: number;
    apartament_id: number;
    tipo_solicitud: string;
    title: string;
    prioridad: string;
    status: string; 
    create_at: Date;
    update_at: Date;
    resolve_at?: Date;
    assigned_to?:string;
    resolucion_notes?: string
}