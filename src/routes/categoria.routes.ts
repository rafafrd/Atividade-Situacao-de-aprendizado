import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller';

const categoriaRouter = Router();
const categoriaController = new CategoriaController();

categoriaRouter.get('/', categoriaController.listarTodos);
categoriaRouter.get('/:id', categoriaController.buscarPorId);
categoriaRouter.post('/', categoriaController.criar);
categoriaRouter.put('/:id', categoriaController.atualizar);
categoriaRouter.delete('/:id', categoriaController.deletar);

export default categoriaRouter;




































