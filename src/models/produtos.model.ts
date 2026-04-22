export class Produto {
    private readonly _id?: number;
    private _nmProduto: string = '';
    private _preco: number = 0;
    private _idCategoria: number = 0;
    private _idFornecedor: number = 0;

    constructor(
        nmProduto: string,
        preco: number,
        idCategoria: number,
        idFornecedor: number,
        id?: number
    ) {
        this.NmProduto = nmProduto;
        this.Preco = preco;
        this.IdCategoria = idCategoria;
        this.IdFornecedor = idFornecedor;
        this._id = id;
    }

    public get Id(): number | undefined {
        return this._id;
    }

    public get NmProduto(): string {
        return this._nmProduto;
    }

    public get Preco(): number {
        return this._preco;
    }

    public get IdCategoria(): number {
        return this._idCategoria;
    }

    public get IdFornecedor(): number {
        return this._idFornecedor;
    }

    public set NmProduto(value: string) {
        this._validarNmProduto(value);
        this._nmProduto = value;
    }

    public set Preco(value: number) {
        this._validarPreco(value);
        this._preco = value;
    }

    public set IdCategoria(value: number) {
        this._validarIdCategoria(value);
        this._idCategoria = value;
    }

    public set IdFornecedor(value: number) {
        this._validarIdFornecedor(value);
        this._idFornecedor = value;
    }

    public static adicionar(nmProduto: string, preco: number, idCategoria: number, idFornecedor: number): Produto {
        return new Produto(nmProduto, preco, idCategoria, idFornecedor);
    }

    public static editar(nmProduto: string, preco: number, idCategoria: number, idFornecedor: number, id: number): Produto {
        return new Produto(nmProduto, preco, idCategoria, idFornecedor, id);
    }

    private _validarNmProduto(value: string): void {
        if (typeof value !== 'string') {
            throw new TypeError('O nome do produto deve ser um texto(string).');
        }
        if (!value || value.trim().length <= 3) {
            throw new TypeError('O nome do produto deve ter pelo menos 3 caracteres.');
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
