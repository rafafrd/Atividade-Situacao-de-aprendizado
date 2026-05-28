import { LoteEstoqueRepository } from '../repository/loteEstoque.repository';
import { LoteEstoque } from '../models/loteEstoque.model';

interface LoteRow {
    dias_para_vencer: number;
    [key: string]: unknown;
}

export class LoteEstoqueService {
    constructor(private readonly _repository = new LoteEstoqueRepository()) { }

    private _calcularAlerta(diasParaVencer: number): string | null {
        if (diasParaVencer <= 45) return `CRITICO - vence em ${diasParaVencer} dias`;
        if (diasParaVencer <= 90) return `ATENÇÃO - vence em ${diasParaVencer} dias`;
        return null;
    }

    private _adicionarAlertas(lotes: LoteRow[]): LoteRow[] {
        return lotes.map((lote) => {
            const alerta = this._calcularAlerta(lote.dias_para_vencer);
            return alerta !== null ? { ...lote, alerta } : lote;
        });
    }

    /**
     * Retorna todos os lotes de estoque cadastrados.
     * @returns Promise com a lista de lotes.
     */
    async selecionarTodos() {
        const lotes = await this._repository.selectTodos();
        return this._adicionarAlertas(lotes as unknown as LoteRow[]);
    }

    /**
     * Retorna um lote de estoque pelo seu ID.
     * @param id - ID do lote a ser buscado.
     * @returns Promise com os dados do lote encontrado.
     */
    async selecionarPorId(id: number) {
        const lotes = await this._repository.selectById(id);
        return this._adicionarAlertas(lotes as unknown as LoteRow[]);
    }

    /**
     * Cria e persiste um novo lote de estoque após validação.
     * @param idProduto - ID do produto associado ao lote.
     * @param dataVencimento - Data de vencimento do lote.
     * @param quantidade_lote - Quantidade de itens no lote.
     * @returns Promise com o resultado da inserção.
     * @throws {Error} Se a data de vencimento for passada ou a quantidade for zero/negativa.
     */
    async adicionarLote(idProduto: number, dataVencimento: Date, quantidade_lote: number) {
        const lote = new LoteEstoque(idProduto, dataVencimento, quantidade_lote);
        return await this._repository.adicionarLote(lote);
    }

    /**
     * Atualiza um lote de estoque existente após validação.
     * @param id - ID do lote a ser editado.
     * @param idProduto - ID do produto associado.
     * @param dataVencimento - Nova data de vencimento.
     * @param quantidade_lote - Nova quantidade.
     * @returns Promise com o resultado da atualização.
     * @throws {Error} Se a data de vencimento for passada ou a quantidade for zero/negativa.
     */
    async editarLote(id: number, idProduto: number, dataVencimento: Date, quantidade_lote: number) {
        const lote = new LoteEstoque(idProduto, dataVencimento, quantidade_lote, id);
        return await this._repository.editarLote(id, lote);
    }

    /**
     * Remove um lote de estoque pelo seu ID.
     * @param id - ID do lote a ser deletado.
     * @returns Promise com o resultado da exclusão.
     */
    async deletarLote(id: number) {
        return await this._repository.deletarLote(id);
    }
}
