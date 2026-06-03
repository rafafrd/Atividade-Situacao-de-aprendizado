import { apiGet } from './api';

/** Item do relatório de estoque (view `relatorio_estoque`). */
export interface RelatorioItem {
  id_produto: number;
  dc_produto: string;
  preco: number;
  estoque_minimo: number;
  dc_categoria: string;
  dc_fornecedor: string;
  quantidade_atual: number;
  total_em_lotes: number;
  proximo_vencimento: string | null;
  valor_total_estoque: number;
  status_estoque: 'SEM_ESTOQUE' | 'ESTOQUE_BAIXO' | 'NORMAL';
}

/** Item de lote de estoque (endpoint `/lote-estoque`). */
export interface LoteItem {
  id_lote: number;
  id_produto: number;
  dt_vencimento: string; // formato dd-mm-yyyy
  quantidade_lote: number;
  dias_para_vencer: number; // pode ser negativo (já vencido)
}

/** Produto (endpoint `/produtos`). */
export interface ProdutoItem {
  id_produto: number;
  dc_produto: string;
}

/** Relatório de estoque: nome, categoria, qtd atual, mínimo e status em uma chamada. */
export function getRelatorio(): Promise<RelatorioItem[]> {
  return apiGet<RelatorioItem[]>('/estoque/report');
}

/** Lotes de estoque com data de vencimento e dias restantes. */
export function getLotes(): Promise<LoteItem[]> {
  return apiGet<LoteItem[]>('/lote-estoque');
}

/** Lista de produtos (usada para mapear id_produto -> nome). */
export function getProdutos(): Promise<ProdutoItem[]> {
  return apiGet<ProdutoItem[]>('/produtos');
}
