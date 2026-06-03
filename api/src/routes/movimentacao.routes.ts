import { Router } from "express";
import { MovimentacaoController } from "../controllers/movimentacao.controller";
import { AuthMiddleware } from "../middlewares/login.middleware";
import { Role } from "../config/enum/Roles";

const movimentacaoRouter = Router();
const authMiddleware = new AuthMiddleware();
const movimentacaoController = new MovimentacaoController();

//get
movimentacaoRouter.get("/", authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), movimentacaoController.listarTodos);
movimentacaoRouter.get("/:id", authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), movimentacaoController.buscarPorId);

//post
movimentacaoRouter.post("/", authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), movimentacaoController.criarMovimentacao);

//put
movimentacaoRouter.put("/:id", authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), movimentacaoController.atualizarMovimentacao);

//delete
movimentacaoRouter.delete("/:id", authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), movimentacaoController.deletarMovimentacao);

export default movimentacaoRouter;
