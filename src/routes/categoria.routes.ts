import { Router } from 'express';
import { CategoriasController } from '../controllers/categoria.controller';

const categoriaRouter = Router();
const categoriaController = new CategoriasController();

categoriaRouter.get('/', categoriaController.listarTodos);
categoriaRouter.get('/:id', categoriaController.buscarPorId);
categoriaRouter.post('/', categoriaController.criarCategoria);
categoriaRouter.put('/:id', categoriaController.atualizarCategoria);
categoriaRouter.delete('/:id', categoriaController.deletarCategoria);

export default categoriaRouter;




































