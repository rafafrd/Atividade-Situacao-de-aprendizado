/**
 * 20/05/2026 - fornecedores.model.ts
 * Descrição: Este arquivo define a classe Fornecedores, que representa um fornecedor no sistema.
 * Classe que representa um fornecedor, contendo informações sobre o nome e o identificador.
 * Esta classe é utilizada para gerenciar os fornecedores do sistema, permitindo o controle de informações e relacionamentos.
 * Atributos:
 * - _dcFornecedor: Descrição do fornecedor.
 * - _idFornecedor: Identificador único do fornecedor (opcional, gerado automaticamente pelo banco de dados).
 * Métodos:
 * - _validarFornecedor: Valida a descrição do fornecedor.
 * - Construtor: Permite criar uma instância de Fornecedores com os atributos necessários.
 * - Getters e Setters: Permitem acessar e modificar os atributos do fornecedor.
 */
export class Fornecedores {
    private _dcFornecedor: string = '';
    private readonly _idFornecedor?: number;

    constructor(dcFornecedor: string, id?: number) {
        this.DescricaoFornecedor = dcFornecedor;
        this._idFornecedor = id;
    }

    public get IdFornecedor(): number | undefined {
        return this._idFornecedor;
    }

    public get DescricaoFornecedor(): string {
        return this._dcFornecedor;
    }


    public set DescricaoFornecedor(value: string) {
        this._validarDcFornecedor(value);
        this._dcFornecedor = value;
    }


    public static adicionar(DescricaoFornecedor: string): Fornecedores {
        return new Fornecedores(DescricaoFornecedor);
    }

    public static editar(DescricaoFornecedor: string, idFornecedor: number): Fornecedores {
        return new Fornecedores(DescricaoFornecedor, idFornecedor);
    }

    private _validarDcFornecedor(value: string): void {
        if (typeof (value) != "string") {
            throw new TypeError('A descrição do fornecedor deve ser um texto(string)')
        }
        if (!value || value.trim().length <= 3) {
            throw new TypeError('Descricao do fornecedor deve ter pelo menos 3 caracteres')
        }
    }
}