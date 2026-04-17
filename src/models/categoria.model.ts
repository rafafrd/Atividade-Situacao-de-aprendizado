export class Categoria  {
    private _dcCategoria: string = '';
    private readonly _id?: number;

    constructor(dcCategoria: string, id?: number) {
        this.DescricaoCategoria = dcCategoria;
        this._id = id;
    }

    public get Id(): number | undefined {
        return this._id;
    }

    public get DescricaoCategoria(): string {
        return this._dcCategoria;
    }


    public set DescricaoCategoria(value: string) {
        this._validarDcCategoria(value);
        this._dcCategoria = value;
    }


    public static adicionar(DescricaoCategoria: string): Categoria {
        return new Categoria(DescricaoCategoria);
    }

    public static editar(DescricaoCategoria: string, id: number): Categoria {
        return new Categoria(DescricaoCategoria, id);
    }

    private _validarDcCategoria(value: string): void {
        if (typeof (value) != "string") {
            throw new TypeError('A descrição da categoria deve ser um texto(string)')
        }
        if (!value || value.trim().length <= 3) {
            throw new TypeError('Descricao da categoria deve ter pelo menos 3 caracteres')
        }
    }
}