/**
 * 20/05/2026 - loteEstoque.model.ts
 * Descrição: Este arquivo define a classe LoteEstoque, que representa um lote de estoque para um produto específico.
 * Classe que representa um lote de estoque, contendo informações sobre o produto, data de vencimento e quantidade.
 * Esta classe é utilizada para gerenciar os lotes de estoque dos produtos, permitindo o controle de validade e quantidade disponível.
 * Atributos:
 * - idLote: Identificador único do lote (opcional, gerado automaticamente pelo banco de dados).
 * - idProduto: Identificador do produto associado ao lote.
 * - dataVencimento: Data de vencimento do lote.
 * - quantidade: Quantidade de itens disponíveis no lote.
 * Métodos:
 * - validar_vencimento: Valida se a data de vencimento é uma data futura. (now() < dataVencimento)
 * - _validarQuantidadeLote: Valida se a quantidade é maior que zero. (quantidade > 0)
 * - notificarEstoqueMinimo: Notifica quando a quantidade do lote atingir um nível mínimo (quantidade <= 10).
 * - Construtor: Permite criar uma instância de LoteEstoque com os atributos necessários.
 * - Getters e Setters: Permitem acessar e modificar os atributos do lote de estoque.
 */
export class LoteEstoque {
  private readonly _idLote?: number;
  private readonly _idProduto: number = 0;
  private _dataVencimento: Date = new Date();
  private _quantidade_lote: number = 0;

  constructor(
    idProduto: number,
    dataVencimento: Date,
    quantidade: number,
    idLote?: number,
  ) {
    this._idProduto = idProduto;
    this.DataVencimento = dataVencimento;
    this.Quantidade = quantidade;
    this._idLote = idLote;
  }
  // getters
  public get IdLote(): number | undefined {
    return this._idLote;
  }
  public get IdProduto(): number {
    return this._idProduto;
  }
  public get DataVencimento(): Date {
    return this._dataVencimento;
  }
  public get Quantidade(): number {
    return this._quantidade_lote;
  }

  // setters
  public set DataVencimento(value: Date) {
    this._validarDataVencimento(value);
    this._dataVencimento = value;
  }
  public set Quantidade(value: number) {
    this._validarQuantidadeLote(value);
    this._quantidade_lote = value;
  }


  private _validarQuantidadeLote(value: number): void {
    if (typeof value !== "number" || value <= 0) {
      throw new TypeError(
        "A quantidade do lote deve ser um número válido e não negativo.",
      );
    }
  }

  // melhorar essa função para enviar um json
  private _validarDataVencimento(value: Date): void {
    const hoje = new Date();
    if (value <= hoje) {
      throw new Error("A data de vencimento deve ser uma data futura.");
    }
  }
}
