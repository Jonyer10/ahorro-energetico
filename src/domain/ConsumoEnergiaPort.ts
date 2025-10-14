import { ConsumoEnergia } from "./ConsumoEnergia";

export interface ConsumoEnergiaPort{
    getByApartamentIdAndMonth(apartament_id: number, month: any): unknown;
    getAll(): ConsumoEnergia[] | PromiseLike<ConsumoEnergia[]>;
    create(consumo: Omit<ConsumoEnergia, "id">): number | PromiseLike<number>;
    getById(id: number): ConsumoEnergia | PromiseLike<ConsumoEnergia | null> | null;
    update(id: number, consumo: Partial<ConsumoEnergia>): boolean | Promise<boolean>;
    delete(id: number): boolean | PromiseLike<boolean>;
    }