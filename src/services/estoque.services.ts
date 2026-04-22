import { EstoqueRepository } from '../repository/estoque.repository';
import { Estoque } from '../models/estoque.model';

export class EstoqueService {
    constructor(private readonly _repository = new EstoqueRepository()) { }

    /**
     * Retorna todos os registros de estoque.
     * @returns Promise com a lista de estoques.
     */
    async selecionarTodos() {
        return await this._repository.selectTodos();
    }

    /**
     * Retorna um registro de estoque pelo seu ID.
     * @param id - ID do estoque a ser buscado.
     * @returns Promise com os dados do estoque encontrado.
     */
    async selecionarPorId(id: number) {
        return await this._repository.selectById(id);
    }

    /**
     * Cria um novo registro de estoque no banco de dados.
     * @param idProduto - ID do produto a ser associado ao estoque.
     * @param quantidadeAtual - Quantidade inicial em estoque.
     * @returns Promise com o resultado da inserção.
     */
    async adicionarEstoque(idProduto: number, quantidadeAtual: number) {
        const estoque = Estoque.adicionar(idProduto, quantidadeAtual);
        return await this._repository.adicionarEstoque(estoque);
    }

    /**
     * Atualiza um registro de estoque existente.
     * @param id - ID do estoque a ser editado.
     * @param idProduto - ID do produto associado.
     * @param quantidadeAtual - Nova quantidade em estoque.
     * @returns Promise com o resultado da atualização.
     */
    async editarEstoque(id: number, idProduto: number, quantidadeAtual: number) {
        const estoque = Estoque.editar(idProduto, quantidadeAtual, id);
        return await this._repository.editarEstoque(id, estoque);
    }

    /**
     * Remove um registro de estoque pelo seu ID.
     * @param id - ID do estoque a ser deletado.
     * @returns Promise com o resultado da exclusão.
     */
    async deletarEstoque(id: number) {
        return await this._repository.deletarEstoque(id);
    }
}
