import { Router } from 'express';
import { EstoqueController } from '../controllers/estoque.controller';
import { AuthMiddleware } from "../middlewares/login.middleware";
import { Role } from "../config/enum/Roles";

const estoqueRouter = Router();
const authMiddleware = new AuthMiddleware();
const estoqueController = new EstoqueController();

estoqueRouter.get('/', authMiddleware.authenticate, estoqueController.listarTodos);
estoqueRouter.get('/report', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN, Role.USER), estoqueController.relatorioEstoque);
estoqueRouter.get('/:id', authMiddleware.authenticate, estoqueController.buscarPorId);
estoqueRouter.post('/', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), estoqueController.criarEstoque);
estoqueRouter.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), estoqueController.atualizarEstoque);
estoqueRouter.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), estoqueController.deletarEstoque);

export default estoqueRouter;
