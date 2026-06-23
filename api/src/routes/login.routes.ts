import { Router } from "express";
import { LoginController } from "../controllers/login.controller";

const loginController = new LoginController();
const loginRoutes = Router();

// Rotas públicas
loginRoutes.post('/login', loginController.login);
loginRoutes.post('/registro', loginController.criar);

export default loginRoutes;