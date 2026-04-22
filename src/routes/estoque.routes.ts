import { Router } from 'express';
import { EstoqueController } from '../controllers/estoque.controller';

const estoqueRouter = Router();
const estoqueController = new EstoqueController();

estoqueRouter.get('/', estoqueController.listarTodos);
estoqueRouter.get('/:id', estoqueController.buscarPorId);
estoqueRouter.post('/', estoqueController.criarEstoque);
estoqueRouter.put('/:id', estoqueController.atualizarEstoque);
estoqueRouter.delete('/:id', estoqueController.deletarEstoque);

export default estoqueRouter;
