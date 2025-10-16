import { Router } from "express";
import { UserAdapter } from "../adapter/UserAdapter.ts";
import { UserApplicationService } from "../../application/UserApplicationService.ts";
import { UserController } from "../controller/UserController.ts";


const router = Router();


// Crear instancias de los adaptadores, servicios y controladores
const userAdapter = new UserAdapter();
const userApplicationService = new UserApplicationService(userAdapter);
const userController = new UserController(userApplicationService);

//definir las rutas y asociarlas con los métodos del controlador
router.post("/users", async (req, res) =>{
    try {
        await userController.createUser(req, res);

    } catch (error) {
        res.status(400).json({ message: "Error Creacion de usuario", error });
    }
});

router.get("/users", async (req, res) => {
    try {
        await userController.getAllUsers(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al obtener usuarios", error });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        await userController.getUserById(req, res); 
    } catch (error) {
        res.status(400).json({ message: "Error al obtener usuario por ID", error });
    }
});
router.get("/users/:email", async (req, res) => {
    try {
        await userController.getUserByEmail(req, res); 
    } catch (error) {
        res.status(400).json({ message: "Error al obtener usuario por email", error });
    }
});

router.put("/users/:id", async (req, res) => {
    try {
        await userController.updateUser(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar usuario", error });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        await userController.deleteUser(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar usuario", error });
    }
});
export default router;