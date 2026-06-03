import { Router } from 'express';
import { CategoriasController } from '../controllers/categoria.controller';
import { AuthMiddleware } from "../middlewares/login.middleware";
import { Role } from "../config/enum/Roles";

const categoriaRouter = Router();
const categoriaController = new CategoriasController();
const authMiddleware = new AuthMiddleware();

categoriaRouter.get('/', authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), categoriaController.listarTodos);
categoriaRouter.get('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), categoriaController.buscarPorId);
categoriaRouter.post('/', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), categoriaController.criarCategoria);
categoriaRouter.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), categoriaController.atualizarCategoria);
categoriaRouter.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), categoriaController.deletarCategoria);

export default categoriaRouter;