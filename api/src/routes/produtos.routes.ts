import { Router } from 'express';
import { ProdutosController } from '../controllers/produtos.controller';
import uploadImage from '../middlewares/uploadImage.middleware';

const produtosRouter = Router();
const produtosController = new ProdutosController();

produtosRouter.get('/', produtosController.listarTodos);
produtosRouter.get('/:id', produtosController.buscarPorId);
produtosRouter.post('/', uploadImage, produtosController.criarProduto);
produtosRouter.put('/:id', uploadImage, produtosController.atualizarProduto);
produtosRouter.delete('/:id', produtosController.deletarProduto);

export default produtosRouter;
