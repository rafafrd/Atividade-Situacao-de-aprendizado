import { Router } from "express";
import { FornecedoresController } from "../controllers/fornecedores.controller";
import { AuthMiddleware } from "../middlewares/login.middleware";
import { Role } from "../config/enum/Roles";

const fornecedoresRouter = Router();
const authMiddleware = new AuthMiddleware();
const fornecedoresController = new FornecedoresController();

//get
fornecedoresRouter.get("/", authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), fornecedoresController.listarTodos);
fornecedoresRouter.get("/:id", authMiddleware.authenticate, authMiddleware.authorize(Role.USER, Role.MANAGER, Role.ADMIN), fornecedoresController.buscarPorId); //criar rota para buscar por id

//post
fornecedoresRouter.post("/", authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN),  fornecedoresController.criarFornecedor);

//put
fornecedoresRouter.put("/:id", authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), fornecedoresController.atualizarFornecedor);

//delete
fornecedoresRouter.delete("/:id", authMiddleware.authenticate, authMiddleware.authorize(Role.MANAGER, Role.ADMIN), fornecedoresController.deletarFornecedor);

export default fornecedoresRouter;