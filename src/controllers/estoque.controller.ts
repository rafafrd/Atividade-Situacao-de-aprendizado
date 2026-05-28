import { Request, Response } from 'express';
import { EstoqueService } from '../services/estoque.services';

export class EstoqueController {
    constructor(private readonly _service = new EstoqueService()) { }

    listarTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            const estoques = await this._service.selecionarTodos();
            res.status(200).json({
                mensagem: 'Estoques listados com sucesso.',
                recurso: estoques,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const idEstoque = Number(req.params.id);

            if (Number.isNaN(idEstoque) || idEstoque <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const estoque = await this._service.selecionarPorId(idEstoque);

            if (!estoque || (Array.isArray(estoque) && estoque.length === 0)) {
                res.status(404).json({ mensagem: 'Estoque não encontrado.' });
                return;
            }

            res.status(200).json({
                mensagem: 'Estoque encontrado com sucesso.',
                recurso: estoque,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    criarEstoque = async (req: Request, res: Response): Promise<void> => {
        try {
            const idProduto = Number(req.body.idProduto);
            const { quantidadeAtual } = req.body;

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idProduto', mensagem: 'Informe um idProduto valido.' }],
                });
                return;
            }

            const novoEstoque = await this._service.adicionarEstoque(idProduto, quantidadeAtual);
            res.status(201).json({ novoEstoque });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    atualizarEstoque = async (req: Request, res: Response): Promise<void> => {
        try {
            const idEstoque = Number(req.params.id);

            if (Number.isNaN(idEstoque) || idEstoque <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const idProduto = Number(req.body.idProduto);

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idProduto', mensagem: 'Informe um idProduto valido.' }],
                });
                return;
            }

            const { quantidadeAtual } = req.body;
            const estoqueAlterado = await this._service.editarEstoque(idEstoque, idProduto, quantidadeAtual);

            if (estoqueAlterado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Estoque não encontrado.' });
                return;
            }

            res.status(201).json({ estoqueAlterado });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    relatorioEstoque = async (req: Request, res: Response): Promise<void> => {
        try {
            const relatorio = await this._service.relatorioEstoque();
            res.status(200).json({
                mensagem: 'Relatório de estoque gerado com sucesso.',
                recurso: relatorio,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    deletarEstoque = async (req: Request, res: Response): Promise<void> => {
        try {
            const idEstoque = Number(req.params.id);

            if (Number.isNaN(idEstoque) || idEstoque <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const resultado = await this._service.deletarEstoque(idEstoque);

            if (resultado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Estoque não encontrado.' });
                return;
            }

            res.status(200).json({ mensagem: 'Estoque deletado com sucesso.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };
}
