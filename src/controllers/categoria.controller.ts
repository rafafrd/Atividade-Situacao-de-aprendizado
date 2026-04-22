import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.services';

export class CategoriasController {
  constructor(private readonly _service = new CategoriaService()) { }

  listarTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this._service.selecionarTodos();
      res.status(200).json({
        mensagem: 'Categorias listadas com sucesso.',
        recurso: categorias,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const idCategoria = Number(req.params.id);

      if (idCategoria === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      const categoria = await this._service.selecionarPorId(idCategoria);
      res.status(200).json({
        mensagem: 'Categoria encontrada com sucesso.',
        recurso: categoria,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  };

  criarCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
      const { descricao } = req.body;
      const novaCategoria = await this._service.adicionarCategoria(descricao)
      res.status(201).json({ novaCategoria })
    } catch (error) {
      console.log(error)
      res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  }

  atualizarCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
      const { descricao } = req.body;
      const idCategoria = Number(req.params.id);
      const categoriaAlterada = await this._service.editarCategoria(idCategoria, descricao);
      res.status(201).json({ categoriaAlterada })
    } catch (error) {
      console.log(error)
      res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  }

  deletarCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
      const idCategoria = Number(req.params.id);

      if (idCategoria === null) {
        res.status(400).json({
          mensagem: 'Dados invalidos.',
          erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
        });
        return;
      }

      await this._service.deletarCategoria(idCategoria);
      res.status(200).json({ mensagem: 'Categoria deletada com sucesso.' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  };
}
