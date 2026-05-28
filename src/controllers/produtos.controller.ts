import { Request, Response } from 'express';
import { ProdutosService } from '../services/produtos.services';

export class ProdutosController {
    constructor(private readonly _service = new ProdutosService()) { }

    listarTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            const produtos = await this._service.selecionarTodos();
            res.status(200).json({
                mensagem: 'Produtos listados com sucesso.',
                recurso: produtos,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const idProduto = Number(req.params.id);

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const produto = await this._service.selecionarPorId(idProduto);

            if (!produto || (Array.isArray(produto) && produto.length === 0)) {
                res.status(404).json({ mensagem: 'Produto não encontrado.' });
                return;
            }

            res.status(200).json({
                mensagem: 'Produto encontrado com sucesso.',
                recurso: produto,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    criarProduto = async (req: Request, res: Response): Promise<void> => {
        try {
            const idCategoria = Number(req.body.idCategoria);
            const idFornecedor = Number(req.body.idFornecedor);

            if (Number.isNaN(idCategoria) || idCategoria <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idCategoria', mensagem: 'Informe um idCategoria valido.' }],
                });
                return;
            }

            if (Number.isNaN(idFornecedor) || idFornecedor <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idFornecedor', mensagem: 'Informe um idFornecedor valido.' }],
                });
                return;
            }

            const { dcProduto, preco, estoqueMinimo } = req.body;
            const vinculoImagem = (req as any).file?.filename ?? '';

            const novoProduto = await this._service.adicionarProduto(
                dcProduto,
                vinculoImagem,
                Number(preco),
                Number(estoqueMinimo),
                idCategoria,
                idFornecedor
            );
            res.status(201).json({ novoProduto });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    atualizarProduto = async (req: Request, res: Response): Promise<void> => {
        try {
            const idProduto = Number(req.params.id);

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const idCategoria = Number(req.body.idCategoria);
            const idFornecedor = Number(req.body.idFornecedor);

            if (Number.isNaN(idCategoria) || idCategoria <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idCategoria', mensagem: 'Informe um idCategoria valido.' }],
                });
                return;
            }

            if (Number.isNaN(idFornecedor) || idFornecedor <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idFornecedor', mensagem: 'Informe um idFornecedor valido.' }],
                });
                return;
            }

            const { dcProduto, preco, estoqueMinimo } = req.body;
            const vinculoImagem = (req as any).file?.filename ?? '';

            const produtoAlterado = await this._service.editarProduto(
                idProduto,
                dcProduto,
                vinculoImagem,
                Number(preco),
                Number(estoqueMinimo),
                idCategoria,
                idFornecedor
            );

            if (produtoAlterado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Produto não encontrado.' });
                return;
            }

            res.status(201).json({ produtoAlterado });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    deletarProduto = async (req: Request, res: Response): Promise<void> => {
        try {
            const idProduto = Number(req.params.id);

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const resultado = await this._service.deletarProduto(idProduto);

            if (resultado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Produto não encontrado.' });
                return;
            }

            res.status(200).json({ mensagem: 'Produto deletado com sucesso.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };
}
