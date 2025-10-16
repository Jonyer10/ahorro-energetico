import { Router } from 'express';
import { ApartamentsAdapter } from '../adapter/ApartamentsAdapter';
import { ApartamentApplicationService } from '../../application/ApartamentsApplicationService';
import { ApartamentsController } from '../controller/ApartamentsController';

const router = Router();

// Crear instancias de los adaptadores, servicios y controladores
const apartamentsAdapter = new ApartamentsAdapter();
const apartamentsApplicationService: ApartamentApplicationService = new ApartamentApplicationService(apartamentsAdapter);
const apartamentsController = new ApartamentsController(apartamentsApplicationService);

//definir las rutas y asociarlas con los métodos del controlador
router.post('/apartaments', async (req, res) => {
    try {
        await apartamentsController.createApartament(req, res);
    } catch (error) {
        res.status(500).json({ error: "error en el servidor" });
    }
});

router.get('/apartaments', async (req, res) => {
    try {
        await apartamentsController.getAllApartaments(req, res);
    } catch (error) {
        res.status(500).json({ error: "error en el servidor" });
    }
});

router.get('/apartaments/:id', async (req, res) => {
    try {
        await apartamentsController.getApartamentById(req, res);
    } catch (error) {
        res.status(500).json({ error: "error en el servidor" });
    }
});

router.get ('/apartaments/number/:apartamentnumber', async (req, res) => {
    try {
        await apartamentsController.getApartamentByNumber(req, res);
    } catch (error) {
        res.status(500).json({ error: "error en el servidor" });
    }
});

router.get('/apartaments/user/:userId', async (req, res) => {
    try {
        await apartamentsController.getApartamentByUserId(req, res);
    } catch (error) {
        res.status(500).json({ error: "error en el servidor" });
    }
});

router.put('/apartaments/:id', async (req, res) => {
    try {
        await apartamentsController.updateApartament(req, res);
    } catch (error) {
        res.status(500).json({ error: "error en el servidor" });
    }
});

router.delete('/apartaments/:id', async (req, res) => {
    try {
        await apartamentsController.deleteApartament(req, res);
    } catch (error) {
        res.status(500).json({ error: "error en el servidor" });
    }
});

export default router;