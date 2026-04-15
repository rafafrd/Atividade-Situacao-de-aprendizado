import { Request, Response } from "express";
import { FornecedoresService } from "../services/fornecedores.repository";

export class FornecedoresController {
    constructor(private readonly _service = new FornecedoresService()) { }

    selecionaTodos = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id);
            if (id) {
                if (Number.isNaN(id) || id <= 0) {
                    return res.status(400).json({
                        message: "ID do Fornecedor inválido ou não fornecido"
                    })
                }
                const resultado = await this._service.selecionarPorId(id);
                if (resultado.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Fornecedor não localizada"
                    });
                }
                res.status(200).json({ resultado })
            }
            const fornecedores = await this._service.selecionarTodos();
            res.status(200).json({ fornecedores })
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Ocorreu um erro no servidor',
                    errorMessage: error.message
                })
            }
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: 'Erro desconhecido'
            })
        }
    }

    adicionarFornecedor = async (req: Request, res: Response) => {
        try {
            const { descricao } = req.body;
            const novoFornecedor = await this._service.adicionarFornecedor(descricao)
            res.status(201).json({ novoFornecedor })
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Ocorreu um erro no servidor',
                    errorMessage: error.message
                })
            }
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: 'Erro desconhecido'
            })
        }
    }

    editarFornecedor = async (req: Request, res: Response) => {
        try {
            const { descricao } = req.body;
            const id = Number(req.query.id);
            const fornecedorAlterado = await this._service.editarFornecedor(id, descricao);
            res.status(201).json({ fornecedorAlterado })
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Ocorreu um erro no servidor',
                    errorMessage: error.message
                })
            }
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: 'Erro desconhecido'
            })
        }
    }
    deletarFornecedor = async (req: Request, res: Response) => {
        try {
            const id = Number(req.query.id);

            if (Number.isNaN(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID do Fornecedor inválido ou não fornecida"
                })
            }

            const fornecedorSelecionado = await this._service.selecionarPorId(id)
            if (fornecedorSelecionado.affectedRows === 0) {
                return res.status(404).json({
                    message: "Fornecedor não localizado"
                });
            }

            const resultadoDelete = await this._service.deletarFornecedor(id);

            if (resultadoDelete.affectedRows !== 0) {
                return res.status(200).json({
                    message: "Fornecedor excluida com sucesso",
                    resultado: resultadoDelete
                })
            } else {
                res.status(500).json({
                    message: "Ocorreu um erro ao excluir o Fornecedor"
                });
            }
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Ocorreu um erro no servidor',
                    errorMessage: error.message
                })
            }
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: 'Erro desconhecido'
            })
        }
    }
}