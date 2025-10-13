
export interface recomendaciones{
     id: number;
     apartament_id: number;
     title: string;
     descripcion: string;
     categoria: string; // distintas categorias como si es eficiente, esta en mantenimiento, tiene ahorro
     prioridad: string; // deben ser alta,media y baja prioridad
     ahorro_estimado?: number;
     costo_ahorro_estimado?:number;
     status:string;
     created_at: Date;
}