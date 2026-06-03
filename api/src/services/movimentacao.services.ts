import { MovimentacaoRepository } from '../repository/movimentacao.repository';
import { Movimentacao, TipoMovimento } from '../models/movimentacao.model';

export class MovimentacaoService {
    constructor(private readonly _repository = new MovimentacaoRepository()) { }

    async selecionarTodos() {
        return await this._repository.selectTodos();
    }

    async selecionarPorId(id: number) {
        return await this._repository.selectById(id);
    }

    async adicionarMovimentacao(
        tipoMovimento: TipoMovimento,
        quantidade: number,
        idLote: number,
        idProduto: number
    ) {
        const movimentacao = Movimentacao.adicionar(tipoMovimento, quantidade, idLote, idProduto);
        return await this._repository.adicionarMovimentacao(movimentacao);
    }

    async editarMovimentacao(
        id: number,
        tipoMovimento: TipoMovimento,
        quantidade: number,
        idLote: number,
        idProduto: number
    ) {
        const movimentacao = Movimentacao.editar(tipoMovimento, quantidade, idLote, idProduto, id);
        return await this._repository.editarMovimentacao(id, movimentacao);
    }

    async deletarMovimentacao(id: number) {
        return await this._repository.deletarMovimentacao(id);
    }
}
