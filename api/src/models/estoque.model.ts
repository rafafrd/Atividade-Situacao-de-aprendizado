/**
 * 20/05/2026 - estoque.model.ts
 * Descrição: Este arquivo define a classe Estoque, que representa um registro de estoque no sistema.
 * Classe que representa um registro de estoque, contendo informações sobre o produto e a quantidade disponível.
 * Esta classe é utilizada para gerenciar o estoque do sistema, permitindo o controle de informações e disponibilidade.
 * Atributos:
 * - _idEstoque: Identificador único do registro de estoque (opcional, gerado automaticamente pelo banco de dados).
 * - _idProduto: Identificador do produto associado ao estoque.
 * - _quantidadeAtual: Quantidade atual disponível em estoque.
 * - _dtUltimaAtualizacao: Data e hora da última atualização do estoque (opcional, gerada automaticamente pelo banco de dados).
 * Métodos:
 * - _validarQuantidadeAtual: Valida se a quantidade é maior que zero. (quantidade > 0)
 * - Construtor: Permite criar uma instância de Estoque com os atributos necessários.
 * - Getters e Setters: Permitem acessar e modificar os atributos do estoque.
 */
export class Estoque {
    private readonly _idEstoque?: number;
    private readonly _idProduto: number = 0;
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
        this._idProduto = idProduto;
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
