import { ConsumoEnergia } from "./ConsumoEnergia";

export interface ConsumoEnergiaPort{
    createConsumo(consumo: Omit<ConsumoEnergia, "id">): Promise <number>;
    getconsumoById(id:number): Promise <ConsumoEnergia | null>;
    getconsumoByApartamentId (apartament_id: number): Promise<ConsumoEnergia[]>;
    getconsumoByMes(apartament_id: number, month: string): Promise <ConsumoEnergia[]>;
    getconnsumoByrangofecha (apartament_id: number, comienzofecha: Date, finalfecha: Date): Promise <ConsumoEnergia []>
    getAllconsumo(): Promise <ConsumoEnergia []>;
    updateconsumo(id: number, consumo: Partial <ConsumoEnergia>): Promise<boolean>;
    deleteconsumo (id: number): Promise <boolean>;
    getavegaeconsumo (apartament_id: number, month: number): Promise <number>;
}