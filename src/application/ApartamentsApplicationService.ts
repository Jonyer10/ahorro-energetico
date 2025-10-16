import { ApartamentPort } from "../domain/ApartamentPort.ts";
import { Apartament } from "../domain/Apartament.ts";

export class ApartamentApplicationService {
    private port: ApartamentPort;

    constructor(port: ApartamentPort) {
        this.port = port;
    }

    async createApartament(apartament: Omit<Apartament, "id">): Promise<number> {
        // se hacen validaciones de negocio
        const existingApartament = await this.port.getApartamentByNumber(String(apartament.apartament_number));
        if (!existingApartament) {
            return this.port.createApartament(apartament);
        }
        throw new Error("apartamento con numero existente");
    }
    async getApartamentById(id: number): Promise<Apartament | null> {
        return await this.port.getApartamentById(id);
    }
    async getAllApartaments(): Promise<Apartament[]> {
        return await this.port.getAllApartaments();
    }
    async updateApartament(id: number, apartament: Partial<Apartament>): Promise<boolean> {
        // Validar si el apartamento existe
        const existingApartament = await this.port.getApartamentById(id);
        if (!existingApartament) {
            throw new Error("apartamento no encontrado");
        }
        if (apartament.apartament_number) {
            const apartamenttaken = await this.port.getApartamentByNumber(String(apartament.apartament_number));
            if (apartamenttaken && apartamenttaken.id !== id) {
                throw new Error("apartamento con numero existente");
            }
        }
        return this.port.updateApartament(id, apartament);
    }
    async deleteApartament(id: number): Promise<boolean> {
        const existingApartament = await this.port.getApartamentById(id);
        if (!existingApartament) {
            throw new Error("apartamento no encontrado");
        }
        return await this.port.deleteApartament(id);
    }


}