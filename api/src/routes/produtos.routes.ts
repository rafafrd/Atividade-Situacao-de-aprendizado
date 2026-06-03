import { Router } from 'express';
import { ProdutosController } from '../controllers/produtos.controller';
import uploadImage from '../middlewares/uploadImage.middleware';
import { AuthMiddleware } from "../middlewares/login.middleware";
import { Role } from "../config/enum/Roles";

const authMiddleware = new AuthMiddleware();
const produtosRouter = Router();
const produtosController = new ProdutosController();

produtosRouter.get('/', authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), produtosController.listarTodos);
produtosRouter.get('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), produtosController.buscarPorId);
produtosRouter.post('/', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), uploadImage, produtosController.criarProduto);
produtosRouter.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), uploadImage, produtosController.atualizarProduto);
produtosRouter.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), produtosController.deletarProduto);

export default produtosRouter;
