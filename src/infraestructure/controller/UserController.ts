import type { UserAplicationService } from "../../application/UserApplicationService.ts";
import type { Request, Response } from "express";
import type { User } from "../../domain/User.ts";
import type { error } from "console";
import { getDefaultResultOrder } from "dns";

export class UserController {
    private app: UserAplicationService;

    constructor(app: UserAplicationService) {
        this.app = app;
    }

    async createUser(req: Request, res: Response) {
        // Lógica para manejar la creación de un usuario
        const { name, email, password, status } = req.body;
        try {
            //validaciones con regexserId
            const nameRegex = /^[a-zA-Z\zAñ]+$/;
            if (!name || !nameRegex.test(name.trim()))
                return res.status(400).json({ message: "Nombre inválido. Solo se permiten letras y espacios." });

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                return res.status(400).json({ error: "Email inválido." });

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/.test(password))
                return res.status(400).json({
                    error: "La contraseña debe tener entre 8 y 25 caracteres, incluyendo letras mayúsculas, minúsculas, números y caracteres especiales."
                });
            const status = 1; // Estado activo por defecto
            const user: Omit<User, "id"> = { name, email, password, status };

            const userId = await this.app.createUser(user);
            return res.status(201).json({ message: "Usuario creado con éxito", userId });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).
                    json({
                        error: "Error del servidor",
                        details: error.message
                    });
            }
            return res.status(500).
                json({
                    error: "Error del servidor"
                });
        }
    }
    async getUserById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            if (isNaN(id)) return res.status(400).json({ message: "El ID debe ser un número  o ID Invalido" });
            const user = await this.app.getUserById(id);
            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
            return res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }
            return res.status(500).json({
                error: "Error del servidor"
            });
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        try {
            const email = typeof req.params.email === "string" ? req.params.email : "";
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                return res.status(400).json({ error: "Email inválido." });
            const user = await this.app.getUserByEmail(email);
            //Validación de email existente, vamos a buscar el email en la base de datos
            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
            return res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error del servidor",
                    details: error.message
                });
            }
            return res.status(500).json({
                error: "Error del servidor"
            });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.app.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error al obtener usuarios",
                    details: error.message
                });
            }
            return res.status(500).json({
                error: "Error al obtener usuarios"
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            if (isNaN(id)) return res.status(400).json({ message: "El ID debe ser un número" });
            await this.app.deleteUser(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error al eliminar usuario",
                    details: error.message
                });
            }
            return res.status(500).json({
                error: "Error al eliminar usuario"
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id ?? "");
            if (isNaN(id)) return res.status(400).json({ message: "El ID debe ser un número" });

            let {name, email, password, status} = req.body;

            // Validaciones antes de actualizar
            if (name && !/^[a-zA-Z\zAñ]+$/.test(name.trim()))
                return res
            .status(400)
            .json({ message: 
                "Nombre inválido. Solo se permiten letras y espacios." 
            });

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
                return res
            .status(400)
            .json({ message: "Email inválido." });

            if (password && (password.length < 6 || password.length.trim() > 25))
                return res
            .status(400)
            .json({ message: "La contraseña debe tener entre 6 y 25 caracteres." });

            const user = await this.app.getUserById(id);
            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

            status = 1; // Aseguramos que el estado sea activo al actualizar

            // Actualizar los campos del usuario
            const updated = await this.app.updateUser(
                id,
                { name, email, password, status },
                { id, user: { name, email, password, status } }
            );
            if (updated) {
                return res
                    .status(404)
                    .json({ message: "Usuario no encontrado o sin cambios" });
            }
            return res.status(200).json({ message: "Usuario actualizado con exito" });
            
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error al actualizar usuario",
                    details: error.message
                });
            }
            return res.status(500).json({
                error: "Error al actualizar usuario"
            });
        }
    }
}