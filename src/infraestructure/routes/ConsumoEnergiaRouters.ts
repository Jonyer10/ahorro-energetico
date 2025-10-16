import { Router } from 'express';
import { ConsumoEnergiaAdapter } from '../adapter/ConsumoEnergiaAdapter';
import { ConsumoEnergiaApplicationService } from '../../application/ConsumoEnergiaApplicationService';
import { ConsumoEnergiaController } from '../controller/ConsumoEnergiaController';

const router = Router();

// Crear instancias de los adaptadores, servicios y controladores
const consumoEnergiaAdapter = new ConsumoEnergiaAdapter();
const consumoEnergiaApplicationService = new ConsumoEnergiaApplicationService(consumoEnergiaAdapter);
const consumoEnergiaController = new ConsumoEnergiaController(consumoEnergiaApplicationService);

// Definir las rutas y asociarlas con los métodos del controlador
router.post('/consumo-energia', async (req, res) => {
    try {
        await consumoEnergiaController.createConsumoEnergia(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error creando el consumo de energía', error });
    }
});

router.get('/consumo-energia', async (req, res) => {
    try {
        await consumoEnergiaController.getAllConsumoEnergias(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los consumos de energía', error });
    }
});

router.get('/consumo-energia/:id', async (req, res) => {
    try {
        await consumoEnergiaController.getConsumoEnergiaById(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo el consumo de energía', error });
    }
});

router.get('/consumo-energia/apartamento/:apartament_id', async (req, res) => {
    try {
        await consumoEnergiaController.getConsumoEnergiaByApartamentId(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los consumos de energía del apartamento', error });
    }
});

router.get('/consumo-energia/apartamento/:apartament_id/mes/:month', async (req, res) => {
    try {
        await consumoEnergiaController.getByApartamentIdAndMonth(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo el consumo de energía del apartamento por mes', error });
    }
});

router.put('/consumo-energia/:id', async (req, res) => {
    try {
        await consumoEnergiaController.updateConsumoEnergia(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando el consumo de energía', error });
    }
});

router.delete('/consumo-energia/:id', async (req, res) => {
    try {
        await consumoEnergiaController.deleteConsumoEnergia(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando el consumo de energía', error });
    }
});

export default router;