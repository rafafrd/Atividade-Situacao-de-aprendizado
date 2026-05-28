import { Request, Response } from 'express';
import { MovimentacaoService } from '../services/movimentacao.services';

export class MovimentacaoController {
    constructor(private readonly _service = new MovimentacaoService()) { }

    listarTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            const movimentacoes = await this._service.selecionarTodos();
            res.status(200).json({
                mensagem: 'Movimentações listadas com sucesso.',
                recurso: movimentacoes,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const idMovimentacao = Number(req.params.id);

            if (isNaN(idMovimentacao) || idMovimentacao <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const movimentacao = await this._service.selecionarPorId(idMovimentacao);

            if (!movimentacao || (Array.isArray(movimentacao) && movimentacao.length === 0)) {
                res.status(404).json({ mensagem: 'Movimentação não encontrada.' });
                return;
            }

            res.status(200).json({
                mensagem: 'Movimentação encontrada com sucesso.',
                recurso: movimentacao,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    criarMovimentacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const idLote = Number(req.body.idLote);
            const idProduto = Number(req.body.idProduto);

            if (isNaN(idLote) || idLote <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idLote', mensagem: 'Informe um idLote valido.' }],
                });
                return;
            }

            if (isNaN(idProduto) || idProduto <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idProduto', mensagem: 'Informe um idProduto valido.' }],
                });
                return;
            }

            const { tipoMovimento, quantidade } = req.body;
            const novaMovimentacao = await this._service.adicionarMovimentacao(
                tipoMovimento,
                Number(quantidade),
                idLote,
                idProduto
            );
            res.status(201).json({ novaMovimentacao });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    atualizarMovimentacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const idMovimentacao = Number(req.params.id);

            if (isNaN(idMovimentacao) || idMovimentacao <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const idLote = Number(req.body.idLote);
            const idProduto = Number(req.body.idProduto);

            if (isNaN(idLote) || idLote <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idLote', mensagem: 'Informe um idLote valido.' }],
                });
                return;
            }

            if (isNaN(idProduto) || idProduto <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idProduto', mensagem: 'Informe um idProduto valido.' }],
                });
                return;
            }

            const { tipoMovimento, quantidade } = req.body;
            const movimentacaoAlterada = await this._service.editarMovimentacao(
                idMovimentacao,
                tipoMovimento,
                Number(quantidade),
                idLote,
                idProduto
            );

            if (movimentacaoAlterada.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Movimentação não encontrada.' });
                return;
            }

            res.status(201).json({ movimentacaoAlterada });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    deletarMovimentacao = async (req: Request, res: Response): Promise<void> => {
        try {
            const idMovimentacao = Number(req.params.id);

            if (isNaN(idMovimentacao) || idMovimentacao <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const resultado = await this._service.deletarMovimentacao(idMovimentacao);

            if (resultado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Movimentação não encontrada.' });
                return;
            }

            res.status(200).json({ mensagem: 'Movimentação deletada com sucesso.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };
}
