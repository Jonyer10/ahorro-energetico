import { Apartament } from "./Apartament.ts";

export interface ApartamentPort {

    getAllApartaments(): Apartament[] | PromiseLike<Apartament[]>;
    createApartament(apartament: Omit<Apartament, "id">): Promise<number>;
    getApartamentById(id: number): Promise<Apartament | null>;
    getApartamentByNumber(apartamentnumber: string): Promise<Apartament | null>;
    getApartamentByUserId(userId: number): Promise<Apartament[]>;
    updateApartament(id: number, apartament: Partial<Apartament>): Promise<boolean>;
    deleteApartament (id: number): Promise<boolean>;
}