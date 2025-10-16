import { Router } from 'express';
import { SolicitudServicioAdapter } from '../adapter/SolicitudServicioAdapter';
import { SolicitudServicioApplicationService } from '../../application/SolicitudServicioApplicationService';
import { SolicitudServicioController } from '../controller/SolicitudServicioController';

const router = Router();

// Crear instancias de los adaptadores, servicios y controladores
const solicitudServicioAdapter = new SolicitudServicioAdapter();
const solicitudServicioApplicationService = new SolicitudServicioApplicationService(solicitudServicioAdapter);
const solicitudServicioController = new SolicitudServicioController(solicitudServicioApplicationService);

// Definir las rutas y asociarlas con los métodos del controlador
router.post('/solicitud-servicio', async (req, res) => {
    try {
        await solicitudServicioController.createSolicitudServicio(req, res);
    
    } catch (error) {
        res.status(500).json({ message: 'Error creando la solicitud de servicio', error });
    }
});

router.get('/solicitud-servicio', async (req, res) => {
    try {
        await solicitudServicioController.getAllSolicitudServicio(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las solicitudes de servicio', error });
    }
});

router.get('/solicitud-servicio/:id', async (req, res) => {
    try {
        await solicitudServicioController.getSolicitudServicioById(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo la solicitud de servicio', error });
    }
});

router.get('/solicitud-servicio/apartamento/:apartament_id', async (req, res) => {
    try {
        await solicitudServicioController.getSolicitudServicioByApartamentId(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las solicitudes de servicio del apartamento', error });
    }
});

router.get('/solicitud-servicio/apartamento/:apartament_id/status/:status', async (req, res) => {
    try {
        await solicitudServicioController.getSolicitudServicioByStatus(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las solicitudes de servicio del apartamento por estado', error });
    }
});

router.get('/solicitud-servicio/apartamento/:apartament_id/tipo/:tipo_solicitud', async (req, res) => {
    try {
        await solicitudServicioController.getSolicitudServicioByType(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las solicitudes de servicio del apartamento por tipo', error });
    }
});

router.put('/solicitud-servicio/:id', async (req, res) => {
    try {
        await solicitudServicioController.updateSolicitudServicio(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando la solicitud de servicio', error });
    }
});

router.delete('/solicitud-servicio/:id', async (req, res) => {
    try {
        await solicitudServicioController.deleteSolicitudServicio(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando la solicitud de servicio', error });
    }
});

export default router;