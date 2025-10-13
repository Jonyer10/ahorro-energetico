import { number } from "joi";

export interface ConsumoEnergia{
    id: Number;
    apartament_id: number;
    consumo_kwh: number;
    cost: number;
    fecha_lectura: Date;
    mes_facturacion: string; // puede ser en formate date, para una mejor precision
    lectura_medidor: number;
    notas?: string;
}