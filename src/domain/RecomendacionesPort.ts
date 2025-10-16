import { Recomendaciones } from './Recomendaciones';

export interface RecomendacionesPort{
    createRecomendaciones(recomendaciones: Omit <Recomendaciones, "id" | "create_at">): Promise <number>;
    getRecomendaciones(id: number): Promise<Recomendaciones | null>;
    getRecomendacionesByApartamentId(apartament_id: number): Promise<boolean>;
    getRecomendacionesByStatus( apartament_id: number, status:string): Promise <Recomendaciones []>;
    getRecomendacionesByCategory (apartament_id:number, categoria: string): Promise <Recomendaciones []>;
    getAllRecomendaciones(): Promise <Recomendaciones[]>;
    updateRecomendaciones (id: number, Recomendaciones: Partial<Recomendaciones>): Promise <boolean>
    deleteRecomendaciones (id:number): Promise<boolean>;
}