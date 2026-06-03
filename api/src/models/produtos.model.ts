/**
 * 20/05/2026 - produto.model.ts
 * Descrição: Este arquivo define a classe Produto, que representa um produto no sistema.
 * Classe que representa um produto, contendo informações sobre a descrição, imagem, preço e estoque.
 * Esta classe é utilizada para gerenciar os produtos do sistema, permitindo o controle de informações e disponibilidade.
 * Atributos:
 * - _idProduto: Identificador único do produto (opcional, gerado automaticamente pelo banco de dados).
 * - _dcProduto: Descrição do produto.
 * - _vinculoImagem: Arquivo vinculado para a imagem do produto.
 * - _preco: Preço do produto.
 * - _estoqueMinimo: Quantidade mínima de estoque do produto.
 * - _idCategoria: Identificador da categoria do produto.
 * - _idFornecedor: Identificador do fornecedor do produto.
 * Métodos:
 * - validar_vencimento: Valida se a data de vencimento é uma data futura. (now() < dataVencimento)
 * - validar_qtde: Valida se a quantidade é maior que zero. (quantidade > 0)
 * - notificarEstoqueMinimo: Notifica quando a quantidade do lote atingir um nível mínimo (quantidade <= 10).
 * - Construtor: Permite criar uma instância de LoteEstoque com os atributos necessários.
 * - Getters e Setters: Permitem acessar e modificar os atributos do lote de estoque.
 */
export class Produto {
    private readonly _idProduto?: number;
    private _dcProduto: string = '';
    private readonly _vinculoImagem: string = '';
    private _preco: number = 0;
    private _estoqueMinimo: number = 0;
    private readonly _idCategoria: number = 0;
    private readonly _idFornecedor: number = 0;

    constructor(
        dcProduto: string,
        vinculoImagem: string,
        preco: number,
        estoqueMinimo: number,
        idCategoria: number,
        idFornecedor: number,
        idProduto?: number
    ) {
        this.DescricaoProduto = dcProduto;
        this._vinculoImagem = vinculoImagem;
        this.Preco = preco;
        this.EstoqueMinimo = estoqueMinimo;
        this._idCategoria = idCategoria;
        this._idFornecedor = idFornecedor;
        this._idProduto = idProduto;
    }

    public get IdProduto(): number | undefined {
        return this._idProduto;
    }

    public get DescricaoProduto(): string {
        return this._dcProduto;
    }

    public get VinculoImagem(): string {
        return this._vinculoImagem;
    }

    public get Preco(): number {
        return this._preco;
    }

    public get EstoqueMinimo(): number {
        return this._estoqueMinimo;
    }

    public get IdCategoria(): number {
        return this._idCategoria;
    }

    public get IdFornecedor(): number {
        return this._idFornecedor;
    }

    public set DescricaoProduto(value: string) {
        this._validarDcProduto(value);
        this._dcProduto = value;
    }

    public set Preco(value: number) {
        this._validarPreco(value);
        this._preco = value;
    }

    public set EstoqueMinimo(value: number) {
        this._validarEstoqueMinimo(value);
        this._estoqueMinimo = value;
    }

    public static adicionar(
        dcProduto: string,
        vinculoImagem: string,
        preco: number,
        estoqueMinimo: number,
        idCategoria: number,
        idFornecedor: number
    ): Produto {
        return new Produto(dcProduto, vinculoImagem, preco, estoqueMinimo, idCategoria, idFornecedor);
    }

    public static editar(
        dcProduto: string,
        vinculoImagem: string,
        preco: number,
        estoqueMinimo: number,
        idCategoria: number,
        idFornecedor: number,
        idProduto: number
    ): Produto {
        return new Produto(dcProduto, vinculoImagem, preco, estoqueMinimo, idCategoria, idFornecedor, idProduto);
    }

    private _validarDcProduto(value: string): void {
        if (typeof value !== 'string') {
            throw new TypeError('A descrição do produto deve ser um texto(string).');
        }
        if (!value || value.trim().length <= 3) {
            throw new TypeError('A descrição do produto deve ter pelo menos 3 caracteres.');
        }
    }

    private _validarPreco(value: number): void {
        if (typeof value !== 'number') {
            throw new TypeError('O preço do produto deve ser um número.');
        }
        if (value < 0) {
            throw new TypeError('O preço do produto não pode ser negativo.');
        }
    }

    private _validarEstoqueMinimo(value: number): void {
        if (typeof value !== 'number') {
            throw new TypeError('O estoque mínimo deve ser um número.');
        }
        if (value < 0) {
            throw new TypeError('O estoque mínimo não pode ser negativo.');
        }
    }
}
