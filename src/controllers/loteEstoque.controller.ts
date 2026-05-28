import { Request, Response } from 'express';
import { LoteEstoqueService } from '../services/loteEstoque.services';

export class LoteEstoqueController {
    constructor(private readonly _service = new LoteEstoqueService()) { }

    listarTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            const lotes = await this._service.selecionarTodos();
            res.status(200).json({
                mensagem: 'Lotes de estoque listados com sucesso.',
                recurso: lotes,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const idLote = Number(req.params.id);

            if (Number.isNaN(idLote) || idLote <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const lote = await this._service.selecionarPorId(idLote);

            if (!lote || (Array.isArray(lote) && lote.length === 0)) {
                res.status(404).json({ mensagem: 'Lote de estoque não encontrado.' });
                return;
            }

            res.status(200).json({
                mensagem: 'Lote de estoque encontrado com sucesso.',
                recurso: lote,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    criarLote = async (req: Request, res: Response): Promise<void> => {
        try {
            const idProduto = Number(req.body.idProduto);

            if (Number.isNaN(idProduto) || idProduto <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'idProduto', mensagem: 'Informe um idProduto valido.' }],
                });
                return;
            }

            const { dataVencimento, quantidade_lote } = req.body;
            const novoLote = await this._service.adicionarLote(idProduto, new Date(dataVencimento), quantidade_lote);
            res.status(201).json({ novoLote });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    atualizarLote = async (req: Request, res: Response): Promise<void> => {
        try {
            const idLote = Number(req.params.id);

            if (Number.isNaN(idLote) || idLote <= 0) {
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

            const { dataVencimento, quantidade_lote } = req.body;
            const loteAlterado = await this._service.editarLote(idLote, idProduto, new Date(dataVencimento), quantidade_lote);

            if (loteAlterado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Lote de estoque não encontrado.' });
                return;
            }

            res.status(201).json({ loteAlterado });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    deletarLote = async (req: Request, res: Response): Promise<void> => {
        try {
            const idLote = Number(req.params.id);

            if (Number.isNaN(idLote) || idLote <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const resultado = await this._service.deletarLote(idLote);

            if (resultado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Lote de estoque não encontrado.' });
                return;
            }

            res.status(200).json({ mensagem: 'Lote de estoque deletado com sucesso.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };
}
