export class Estoque {
    private readonly _idEstoque?: number;
    private _idProduto: number = 0;
    private _quantidadeAtual: number = 0;
    private readonly _dtUltimaAtualizacao?: Date;

    /**
     * Cria uma nova instância de Estoque.
     * @param idProduto - ID do produto associado ao estoque.
     * @param quantidadeAtual - Quantidade atual disponível em estoque.
     * @param idEstoque - (Opcional) ID do registro de estoque (gerado pelo banco).
     * @param dtUltimaAtualizacao - (Opcional) Data da última atualização (gerada pelo banco).
     */
    constructor(
        idProduto: number,
        quantidadeAtual: number,
        idEstoque?: number,
        dtUltimaAtualizacao?: Date
    ) {
        this.IdProduto = idProduto;
        this.QuantidadeAtual = quantidadeAtual;
        this._idEstoque = idEstoque;
        this._dtUltimaAtualizacao = dtUltimaAtualizacao;
    }

    /** @returns ID do registro de estoque, ou undefined se ainda não persistido. */
    public get IdEstoque(): number | undefined {
        return this._idEstoque;
    }

    /** @returns ID do produto vinculado a este estoque. */
    public get IdProduto(): number {
        return this._idProduto;
    }

    /** @returns Quantidade atual disponível em estoque. */
    public get QuantidadeAtual(): number {
        return this._quantidadeAtual;
    }

    /** @returns Data e hora da última atualização do estoque, ou undefined. */
    public get DtUltimaAtualizacao(): Date | undefined {
        return this._dtUltimaAtualizacao;
    }

    /**
     * Define o ID do produto, aplicando validação.
     * @param value - ID do produto a ser associado.
     * @throws {TypeError} Se o valor não for um número válido maior que zero.
     */
    public set IdProduto(value: number) {
        this._validarIdProduto(value);
        this._idProduto = value;
    }

    /**
     * Define a quantidade atual, aplicando validação.
     * @param value - Quantidade a ser registrada.
     * @throws {TypeError} Se o valor não for um número válido e não negativo.
     */
    public set QuantidadeAtual(value: number) {
        this._validarQuantidadeAtual(value);
        this._quantidadeAtual = value;
    }

    /**
     * Cria uma instância de Estoque para adição (sem ID).
     * @param idProduto - ID do produto associado.
     * @param quantidadeAtual - Quantidade inicial em estoque.
     * @returns Nova instância de Estoque sem ID.
     */
    public static adicionar(idProduto: number, quantidadeAtual: number): Estoque {
        return new Estoque(idProduto, quantidadeAtual);
    }

    /**
     * Cria uma instância de Estoque para edição (com ID).
     * @param idProduto - ID do produto associado.
     * @param quantidadeAtual - Nova quantidade em estoque.
     * @param id - ID do registro de estoque a ser atualizado.
     * @returns Instância de Estoque com ID definido.
     */
    public static editar(idProduto: number, quantidadeAtual: number, id: number): Estoque {
        return new Estoque(idProduto, quantidadeAtual, id);
    }

    /**
     * Valida se o ID do produto é um número maior que zero.
     * @param value - Valor a ser validado.
     * @throws {TypeError} Se o valor não for do tipo number ou for menor/igual a zero.
     */
    private _validarIdProduto(value: number): void {
        if (typeof value !== 'number') {
            throw new TypeError('O id do produto deve ser um número.');
        }
        if (value <= 0) {
            throw new TypeError('O id do produto deve ser um número válido maior que zero.');
        }
    }

    /**
     * Valida se a quantidade atual é um número não negativo.
     * @param value - Valor a ser validado.
     * @throws {TypeError} Se o valor não for do tipo number ou for negativo.
     */
    private _validarQuantidadeAtual(value: number): void {
        if (typeof value !== 'number') {
            throw new TypeError('A quantidade atual deve ser um número.');
        }
        if (value < 0) {
            throw new TypeError('A quantidade atual não pode ser negativa.');
        }
    }
}
