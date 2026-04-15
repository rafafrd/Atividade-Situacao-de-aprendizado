import { FornecedoresRepository } from "../repository/fornecedores.repository";
import { Fornecedores } from "../models/fornecedores.model";

export class FornecedoresService {
    constructor(private readonly _repository = new FornecedoresRepository()) { }

    async selecionarTodos() {
        return await this._repository.selectTodos();
    }

    async selecionarPorId(id: number) {
        return await this._repository.selectById(id);
    }

    async adicionarFornecedor(Descricao: string) {
        const fornecedor = Fornecedores.adicionar(Descricao);
        return await this._repository.adicionarFornecedor(fornecedor)
    }

    async editarFornecedor(id: number, Descricao: string) {
        const fornecedor = Fornecedores.editar(Descricao, id)
        return await this._repository.editarFornecedor(id, fornecedor)
    }

    async deletarFornecedor(id: number) {
        return await this._repository.deletarFornecedor(id)
    }
}