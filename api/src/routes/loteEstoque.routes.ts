import { Router } from 'express';
import { LoteEstoqueController } from '../controllers/loteEstoque.controller';

const loteEstoqueRouter = Router();
const loteEstoqueController = new LoteEstoqueController();

loteEstoqueRouter.get('/', loteEstoqueController.listarTodos);
loteEstoqueRouter.get('/:id', loteEstoqueController.buscarPorId);
loteEstoqueRouter.post('/', loteEstoqueController.criarLote);
loteEstoqueRouter.put('/:id', loteEstoqueController.atualizarLote);
loteEstoqueRouter.delete('/:id', loteEstoqueController.deletarLote);

export default loteEstoqueRouter;
