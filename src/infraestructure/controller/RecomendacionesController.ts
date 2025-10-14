import { RecomendacionesApplicationService } from '../../application/RecomendacionesApplicationService';
import { Recomendaciones } from '../../domain/Recomendaciones';







export class RecomendacionesController { 
    private app: RecomendacionesApplicationService;

    constructor(app: RecomendacionesApplicationService) {
        this.app = app;
    }

    async createRecomendaciones(req: Request, res: Response) {
        const { id, Apartament_id }
        try {
            // Validar con regex
            const RecomendacionesRegex = /
        } catch (error) {
            
        }
    }
}