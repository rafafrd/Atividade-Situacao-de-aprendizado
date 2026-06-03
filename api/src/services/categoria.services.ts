import { CategoriaRepository } from "../repository/categoria.repository";
import { Categoria } from "../models/categoria.model";

export class CategoriaService {
    constructor(private readonly _repository = new CategoriaRepository()) { }

    async selecionarTodos() {
        return await this._repository.selectTodos();
    }

    async selecionarPorId(id: number) {
        return await this._repository.selectById(id);
    }

    async adicionarCategoria(Descricao: string) {
        const categoria = Categoria.adicionar(Descricao);
        return await this._repository.adicionarCategoria(categoria)
    }

    async editarCategoria(id: number, Descricao: string) {
        const categoria = Categoria.editar(Descricao, id)
        return await this._repository.editarCategoria(id, categoria)
    }

    async deletarCategoria(id: number) {
        return await this._repository.deletarCategoria(id)
    }
}