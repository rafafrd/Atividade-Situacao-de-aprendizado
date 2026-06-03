import { Router } from 'express';
import { LoteEstoqueController } from '../controllers/loteEstoque.controller';
import { AuthMiddleware } from "../middlewares/login.middleware";
import { Role } from "../config/enum/Roles";

const loteEstoqueRouter = Router();
const loteEstoqueController = new LoteEstoqueController();
const authMiddleware = new AuthMiddleware();

loteEstoqueRouter.get('/', authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), loteEstoqueController.listarTodos);
loteEstoqueRouter.get('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), loteEstoqueController.buscarPorId);
loteEstoqueRouter.post('/', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), loteEstoqueController.criarLote);
loteEstoqueRouter.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), loteEstoqueController.atualizarLote);
loteEstoqueRouter.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), loteEstoqueController.deletarLote);

export default loteEstoqueRouter;
