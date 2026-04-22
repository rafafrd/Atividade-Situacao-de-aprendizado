export class Produto {
    private readonly _idProduto?: number;
    private _dcProduto: string = '';
    private _vinculoImagem: string = '';
    private _preco: number = 0;
    private _estoqueMinimo: number = 0;
    private _idCategoria: number = 0;
    private _idFornecedor: number = 0;

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
        this.VinculoImagem = vinculoImagem;
        this.Preco = preco;
        this.EstoqueMinimo = estoqueMinimo;
        this.IdCategoria = idCategoria;
        this.IdFornecedor = idFornecedor;
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

    public set VinculoImagem(value: string) {
        this._validarVinculoImagem(value);
        this._vinculoImagem = value;
    }

    public set Preco(value: number) {
        this._validarPreco(value);
        this._preco = value;
    }

    public set EstoqueMinimo(value: number) {
        this._validarEstoqueMinimo(value);
        this._estoqueMinimo = value;
    }

    public set IdCategoria(value: number) {
        this._validarIdCategoria(value);
        this._idCategoria = value;
    }

    public set IdFornecedor(value: number) {
        this._validarIdFornecedor(value);
        this._idFornecedor = value;
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

    private _validarVinculoImagem(value: string): void {
        if (typeof value !== 'string') {
            throw new TypeError('O vínculo de imagem deve ser um texto(string).');
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

    private _validarIdCategoria(value: number): void {
        if (typeof value !== 'number') {
            throw new TypeError('O id da categoria deve ser um número.');
        }
        if (value <= 0) {
            throw new TypeError('O id da categoria deve ser um número válido maior que zero.');
        }
    }

    private _validarIdFornecedor(value: number): void {
        if (typeof value !== 'number') {
            throw new TypeError('O id do fornecedor deve ser um número.');
        }
        if (value <= 0) {
            throw new TypeError('O id do fornecedor deve ser um número válido maior que zero.');
        }
    }
}
