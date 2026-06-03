import { ProdutosRepository } from '../repository/produtos.repository';
import { Produto } from '../models/produtos.model';

export class ProdutosService {
    constructor(private readonly _repository = new ProdutosRepository()) { }

    async selecionarTodos() {
        return await this._repository.selectTodos();
    }

    async selecionarPorId(id: number) {
        return await this._repository.selectById(id);
    }

    async adicionarProduto(
        dcProduto: string,
        vinculoImagem: string,
        preco: number,
        estoqueMinimo: number,
        idCategoria: number,
        idFornecedor: number
    ) {
        const produto = Produto.adicionar(dcProduto, vinculoImagem, preco, estoqueMinimo, idCategoria, idFornecedor);
        return await this._repository.adicionarProduto(produto);
    }

    async editarProduto(
        id: number,
        dcProduto: string,
        vinculoImagem: string,
        preco: number,
        estoqueMinimo: number,
        idCategoria: number,
        idFornecedor: number
    ) {
        const produto = Produto.editar(dcProduto, vinculoImagem, preco, estoqueMinimo, idCategoria, idFornecedor, id);
        return await this._repository.editarProduto(id, produto);
    }

    async deletarProduto(id: number) {
        return await this._repository.deletarProduto(id);
    }
}
