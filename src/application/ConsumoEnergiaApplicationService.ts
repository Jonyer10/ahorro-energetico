import { ConsumoEnergia } from "../domain/ConsumoEnergia";
import { ConsumoEnergiaPort } from "../domain/ConsumoEnergiaPort";


export class ConsumoEnergiaApplicationService {
    getConsumoEnergiaByApartamentId(apartament_id: string) {
        throw new Error('Method not implemented.');
    }
    private port: ConsumoEnergiaPort;

    constructor(port: ConsumoEnergiaPort) {
        this.port = port;
    }

    async createConsumoEnergia(consumo: Omit<ConsumoEnergia, "id">): Promise<number> {
        // se hacen validaciones de negocio
        const existingConsumo = await this.port.getByApartamentIdAndMonth(consumo.apartament_id, consumo.mes_facturacion);
        if (existingConsumo) {
            return this.port.create(consumo);
            }
        throw new Error("Consumo de energia ya registrado para este apartamento y mes");
    }
    
    async getConsumoEnergiaById(id: number): Promise<ConsumoEnergia | null> {
        return await this.port.getById(id);
    }

    async getByApartamentIdAndMonth(apartament_id: number, month: string): Promise<ConsumoEnergia | null> {
        const result = await this.port.getByApartamentIdAndMonth(apartament_id, month);
        return result as ConsumoEnergia | null;
    }

    async getAllConsumoEnergia(): Promise<ConsumoEnergia[]> {
        return await this.port.getAll();
    }

    async updateConsumoEnergia(id: number, consumo: Partial<ConsumoEnergia>): Promise<boolean> {
       // Validar si el consumo de energia existe
        const existingConsumo = await this.port.getById(id);
        if (!existingConsumo) {
            throw new Error("Consumo de energia no encontrado");
        }
        if (consumo.mes_facturacion && consumo.apartament_id) {
            const consumotaken = await this.port.getByApartamentIdAndMonth(consumo.apartament_id, consumo.mes_facturacion) as ConsumoEnergia | null;
            if (consumotaken && consumotaken.id !== id) {
                throw new Error("Consumo de energia ya registrado para este apartamento y mes");
            }
        }
        return await this.port.update(id, consumo);
    }                
    
    async deleteConsumoEnergia(id: number): Promise<boolean> {
        const existingConsumo = await this.port.getById(id);
        if (!existingConsumo) {
            throw new Error("Consumo de energia no encontrado");
        }
        return await this.port.delete(id);
    }

}