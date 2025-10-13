import { recomendaciones } from "./Recomendaciones";

export interface RecomendacionPort{
    createRecomendacion(recomendaciones: Omit <recomendaciones, "id" | "create_at">): Promise <number>;
    getRecomendacion(id: number): Promise<recomendaciones | null>;
    getRecomendacionByApartamentId(apartament_id: number): Promise<recomendaciones []>;
    getRecomendacionByStatus( apartament_id: number, status:string): Promise < recomendaciones []>;
    getRecomendacionByCategory (apartament_id:number, categoria: string): Promise <recomendaciones []>;
    getAllRecomendacion(): Promise <recomendaciones[]>;
    updateRecomendacion (id: number, recomendaciones: Partial<recomendaciones>): Promise <boolean>
    deleteRecomendacion (id:number): Promise<boolean>;
}