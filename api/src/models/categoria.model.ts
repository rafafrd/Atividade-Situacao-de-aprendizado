/**
 * 20/05/2026 - categoria.model.ts
 * Descrição: Este arquivo define a classe Categoria, que representa uma categoria no sistema.
 * Classe que representa uma categoria, contendo informações sobre a descrição.
 * Esta classe é utilizada para gerenciar as categorias do sistema, permitindo o controle de informações e organização.
 * Atributos:
 * - _dcCategoria: Descrição da categoria.
 * - _id: Identificador único da categoria (opcional, gerado automaticamente pelo banco de dados).
 * Métodos:
 * - _validarDcCategoria: Valida a descrição da categoria.
 * - Construtor: Permite criar uma instância de Categoria com os atributos necessários.
 * - Getters e Setters: Permitem acessar e modificar os atributos da categoria.
 */
export class Categoria  {
    private _dcCategoria: string = '';
    private readonly _idCategoria?: number;

    constructor(dcCategoria: string, id?: number) {
        this.DescricaoCategoria = dcCategoria;
        this._idCategoria = id;
    }

    public get IdCategoria(): number | undefined {
        return this._idCategoria;
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

    public static editar(DescricaoCategoria: string, idCategoria: number): Categoria {
        return new Categoria(DescricaoCategoria, idCategoria);
    }

    private _validarDcCategoria(value: string): void {
        if (typeof (value) != "string") {
            throw new TypeError('A descrição da categoria deve ser um texto(string)')
        }
        if (!value || value.trim().length <= 3) {
            throw new TypeError('A descrição da categoria deve ter pelo menos 3 caracteres')
        }
    }
}