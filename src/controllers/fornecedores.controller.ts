import { Request, Response } from 'express';
import { FornecedoresService } from '../services/fornecedores.services';

export class FornecedoresController {
    constructor(private readonly _service = new FornecedoresService()) { }

    listarTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            const fornecedores = await this._service.selecionarTodos();
            res.status(200).json({
                mensagem: 'Fornecedores listados com sucesso.',
                recurso: fornecedores,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const idFornecedor = Number(req.params.id);

            if (Number.isNaN(idFornecedor) || idFornecedor <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const fornecedor = await this._service.selecionarPorId(idFornecedor);

            if (!fornecedor || (Array.isArray(fornecedor) && fornecedor.length === 0)) {
                res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
                return;
            }

            res.status(200).json({
                mensagem: 'Fornecedor encontrado com sucesso.',
                recurso: fornecedor,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    criarFornecedor = async (req: Request, res: Response): Promise<void> => {
        try {
            const { descricao } = req.body;
            const novoFornecedor = await this._service.adicionarFornecedor(descricao)
            res.status(201).json({ novoFornecedor })
        } catch (error) {
            console.log(error)
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    }

    atualizarFornecedor = async (req: Request, res: Response): Promise<void> => {
        try {
            const idFornecedor = Number(req.params.id);

            if (Number.isNaN(idFornecedor) || idFornecedor <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const { descricao } = req.body;
            const fornecedorAlterado = await this._service.editarFornecedor(idFornecedor, descricao);

            if (fornecedorAlterado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
                return;
            }

            res.status(201).json({ fornecedorAlterado })
        } catch (error) {
            console.log(error)
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    }

    deletarFornecedor = async (req: Request, res: Response): Promise<void> => {
        try {
            const idFornecedor = Number(req.params.id);

            if (Number.isNaN(idFornecedor) || idFornecedor <= 0) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const resultado = await this._service.deletarFornecedor(idFornecedor);

            if (resultado.affectedRows === 0) {
                res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
                return;
            }

            res.status(200).json({ mensagem: 'Fornecedor deletado com sucesso.' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };
}
