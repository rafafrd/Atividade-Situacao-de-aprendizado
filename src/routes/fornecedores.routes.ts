import { Router } from "express";
import { FornecedoresController } from "../controllers/fornecedores.controller";

const fornecedoresRouter = Router();
const fornecedoresController = new FornecedoresController();

//get
fornecedoresRouter.get("/", fornecedoresController.selecionaTodos);
// fornecedoresRouter.get("/:id", fornecedoresController.selecionaTodos); //criar rota para buscar por id

//post
fornecedoresRouter.post("/", fornecedoresController.adicionarFornecedor);

//put
fornecedoresRouter.put("/", fornecedoresController.editarFornecedor);

//delete
fornecedoresRouter.delete("/", fornecedoresController.deletarFornecedor);

export default fornecedoresRouter;