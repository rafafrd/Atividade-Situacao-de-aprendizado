export enum TipoMovimento {
    ENTRADA = 'ENTRADA',
    SAIDA = 'SAIDA'
}

/**
 * 20/05/2026 - movimentacao.model.ts
 * Descrição: Este arquivo define a classe Movimentacao, que representa uma movimentação de estoque no sistema.
 * Classe que representa uma movimentação de estoque, contendo informações sobre o tipo, quantidade e lote.
 * Esta classe é utilizada para gerenciar as movimentações de estoque do sistema, permitindo o controle de entradas e saídas.
 * Atributos:
    * - _idMovimentacao: Identificador único da movimentação (opcional, gerado automaticamente pelo banco de dados).
    * - _tipoMovimento: Tipo da movimentação (ENTRADA ou SAIDA).
    * - _quantidade: Quantidade movimentada.
    * - _idLote: Identificador do lote associado à movimentação.
    * - _idProduto: Identificador do produto associado à movimentação.
    * - _dtMovimentacao: Data e hora da movimentação (opcional, gerada automaticamente pelo banco de dados).
 * Métodos:
 * - _validarQuantidadeAtual: Valida se a quantidade é maior que zero. (quantidade > 0)
 * - Construtor: Permite criar uma instância de Estoque com os atributos necessários.
 * - Getters e Setters: Permitem acessar e modificar os atributos do estoque.
 */
export class Movimentacao {
    private readonly _idMovimentacao?: number;
    private _tipoMovimento!: TipoMovimento;
    private _quantidade: number = 0;
    private readonly _idLote: number;
    private readonly _idProduto: number;
    private readonly _dtMovimentacao?: Date;

    constructor(
        tipoMovimento: TipoMovimento,
        quantidade: number,
        idLote: number,
        idProduto: number,
        idMovimentacao?: number,
        dtMovimentacao?: Date
    ) {
        this.TipoMovimento = tipoMovimento;
        this.Quantidade = quantidade;
        this._idLote = idLote;
        this._idProduto = idProduto;
        this._idMovimentacao = idMovimentacao;
        this._dtMovimentacao = dtMovimentacao;
    }

    public get IdMovimentacao(): number | undefined {
        return this._idMovimentacao;
    }

    public get TipoMovimento(): TipoMovimento {
        return this._tipoMovimento;
    }

    public get Quantidade(): number {
        return this._quantidade;
    }

    public get IdLote(): number {
        return this._idLote;
    }

    public get IdProduto(): number {
        return this._idProduto;
    }

    public get DtMovimentacao(): Date | undefined {
        return this._dtMovimentacao;
    }

    public set TipoMovimento(value: TipoMovimento) {
        this._validarMovimento(value);
        this._tipoMovimento = value;
    }

    public set Quantidade(value: number) {
        this.validarQuantidade(value);
        this._quantidade = value;
    }

    public static adicionar(
        tipoMovimento: TipoMovimento,
        quantidade: number,
        idLote: number,
        idProduto: number
    ): Movimentacao {
        return new Movimentacao(tipoMovimento, quantidade, idLote, idProduto);
    }

    public static editar(
        tipoMovimento: TipoMovimento,
        quantidade: number,
        idLote: number,
        idProduto: number,
        idMovimentacao: number
    ): Movimentacao {
        return new Movimentacao(tipoMovimento, quantidade, idLote, idProduto, idMovimentacao);
    }

    public validarQuantidade(value: number): void {
        if (!Number.isInteger(value)) {
            throw new TypeError('A quantidade deve ser um numero inteiro.');
        }

        if (value <= 0) {
            throw new TypeError('A quantidade deve ser maior que zero.');
        }
    }
    private _validarMovimento(value: TipoMovimento): void {
        if (!Object.values(TipoMovimento).includes(value)) {
            throw new TypeError('Tipo de movimento inválido. Deve ser ENTRADA ou SAIDA.');
        }
}
}