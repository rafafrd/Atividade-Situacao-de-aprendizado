import { Request, Response } from 'express';
import { EstoqueService } from '../services/estoque.services';

export class EstoqueController {
    constructor(private readonly _service = new EstoqueService()) { }

    /**
     * Lista todos os registros de estoque.
     * @param req - Objeto de requisição Express.
     * @param res - Objeto de resposta Express.
     */
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

    /**
     * Busca um registro de estoque pelo ID informado na URL.
     * @param req - Objeto de requisição Express (params.id).
     * @param res - Objeto de resposta Express.
     */
    buscarPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const idEstoque = Number(req.params.id);

            if (idEstoque === null) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            const estoque = await this._service.selecionarPorId(idEstoque);
            res.status(200).json({
                mensagem: 'Estoque encontrado com sucesso.',
                recurso: estoque,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    /**
     * Cria um novo registro de estoque com os dados do corpo da requisição.
     * @param req - Objeto de requisição Express (body: { idProduto, quantidadeAtual }).
     * @param res - Objeto de resposta Express.
     */
    criarEstoque = async (req: Request, res: Response): Promise<void> => {
        try {
            const { idProduto, quantidadeAtual } = req.body;
            const novoEstoque = await this._service.adicionarEstoque(idProduto, quantidadeAtual);
            res.status(201).json({ novoEstoque });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    /**
     * Atualiza um registro de estoque existente pelo ID informado na URL.
     * @param req - Objeto de requisição Express (params.id, body: { idProduto, quantidadeAtual }).
     * @param res - Objeto de resposta Express.
     */
    atualizarEstoque = async (req: Request, res: Response): Promise<void> => {
        try {
            const { idProduto, quantidadeAtual } = req.body;
            const idEstoque = Number(req.params.id);
            const estoqueAlterado = await this._service.editarEstoque(idEstoque, idProduto, quantidadeAtual);
            res.status(201).json({ estoqueAlterado });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    /**
     * Remove um registro de estoque pelo ID informado na URL.
     * @param req - Objeto de requisição Express (params.id).
     * @param res - Objeto de resposta Express.
     */
    deletarEstoque = async (req: Request, res: Response): Promise<void> => {
        try {
            const idEstoque = Number(req.params.id);

            if (idEstoque === null) {
                res.status(400).json({
                    mensagem: 'Dados invalidos.',
                    erros: [{ campo: 'id', mensagem: 'Informe um id valido.' }],
                });
                return;
            }

            await this._service.deletarEstoque(idEstoque);
            res.status(200).json({ mensagem: 'Estoque deletado com sucesso.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.', error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };
}
