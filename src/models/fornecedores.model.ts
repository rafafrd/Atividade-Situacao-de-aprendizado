export class Fornecedores {
    private _dcFornecedor: string = '';
    private readonly _id?: number;

    constructor(dcFornecedor: string, id?: number) {
        this.DescricaoFornecedor = dcFornecedor;
        this._id = id;
    }

    public get Id(): number | undefined {
        return this._id;
    }

    public get DescricaoFornecedor(): string {
        return this._dcFornecedor;
    }


    public set DescricaoFornecedor(value: string) {
        this._validarFornecedor(value);
        this._dcFornecedor = value;
    }


    public static adicionar(DescricaoFornecedor: string): Fornecedores {
        return new Fornecedores(DescricaoFornecedor);
    }

    public static editar(DescricaoFornecedor: string, id: number): Fornecedores {
        return new Fornecedores(DescricaoFornecedor, id);
    }

    private _validarFornecedor(value: string): void {
        if (typeof (value) != "string") {
            throw new TypeError('A descrição do fornecedor deve ser um texto(string)')
        }
        if (!value || value.trim().length <= 3) {
            throw new TypeError('Descricao do fornecedor deve ter pelo menos 3 caracteres')
        }
    }
}