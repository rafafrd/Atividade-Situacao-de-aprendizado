import { Router } from "express";
import { MovimentacaoController } from "../controllers/movimentacao.controller";

const movimentacaoRouter = Router();
const movimentacaoController = new MovimentacaoController();

//get
movimentacaoRouter.get("/", movimentacaoController.listarTodos);
movimentacaoRouter.get("/:id", movimentacaoController.buscarPorId);

//post
movimentacaoRouter.post("/", movimentacaoController.criarMovimentacao);

//put
movimentacaoRouter.put("/:id", movimentacaoController.atualizarMovimentacao);

//delete
movimentacaoRouter.delete("/:id", movimentacaoController.deletarMovimentacao);

export default movimentacaoRouter;
