import { Router } from "express";
import { FornecedoresController } from "../controllers/fornecedores.controller";

const fornecedoresRouter = Router();
const fornecedoresController = new FornecedoresController();

//get
fornecedoresRouter.get("/", fornecedoresController.listarTodos);
fornecedoresRouter.get("/:id", fornecedoresController.buscarPorId); //criar rota para buscar por id

//post
fornecedoresRouter.post("/", fornecedoresController.criarFornecedor);

//put
fornecedoresRouter.put("/:id", fornecedoresController.atualizarFornecedor);

//delete
fornecedoresRouter.delete("/:id ", fornecedoresController.deletarFornecedor);

export default fornecedoresRouter;