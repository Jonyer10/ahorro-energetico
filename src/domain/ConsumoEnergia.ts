import { date } from 'joi';

export interface ConsumoEnergia{

    id: number;
    apartament_id: number;
    consumo_kwh: number;
    cost: number;
    fecha_lectura: Date;
    mes_facturacion: string; // puede ser en formate date, para una mejor precision
    consumo_mensual: number;
    notas?: string;
    length?: number;
}