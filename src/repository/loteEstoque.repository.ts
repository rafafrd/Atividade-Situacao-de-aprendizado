import { db } from '../database/connection.database';
import { LoteEstoque } from '../models/loteEstoque.model';
import { ResultSetHeader } from 'mysql2';

export class LoteEstoqueRepository {

    /**
     * Retorna todos os lotes de estoque cadastrados.
     * @returns Promise com os dados de todos os lotes.
     */
    async selectTodos(): Promise<ResultSetHeader> {
        const sql = 'SELECT id_lote, id_produto, DATE_FORMAT(dt_vencimento, "%d-%m-%Y") AS dt_vencimento, quantidade_lote FROM lote_estoque';
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }

    /**
     * Retorna um lote de estoque pelo seu ID.
     * @param id - ID do lote a ser buscado.
     * @returns Promise com os dados do lote encontrado.
     */
    async selectById(id: number): Promise<ResultSetHeader> {
        const sql = 'SELECT id_lote, id_produto, DATE_FORMAT(dt_vencimento, "%d-%m-%Y") AS dt_vencimento, quantidade_lote FROM lote_estoque WHERE id_lote = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    /**
     * Insere um novo lote de estoque no banco de dados.
     * @param dados - Instância de lote_estoque com os dados a serem inseridos.
     * @returns Promise com o resultado da operação de inserção.
     */
    async adicionarLote(dados: LoteEstoque): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO lote_estoque (id_produto, dt_vencimento, quantidade_lote) VALUES (?, ?, ?)';
        const values = [dados.IdProduto, dados.DataVencimento, dados.Quantidade];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    /**
     * Atualiza a data de vencimento e a quantidade de um lote de estoque existente.
     * @param id - ID do lote a ser atualizado.
     * @param dados - Instância de lote_estoque com os novos dados.
     * @returns Promise com o resultado da operação de atualização.
     */
    async editarLote(id: number, dados: LoteEstoque): Promise<ResultSetHeader> {
        const sql = 'UPDATE lote_estoque SET dt_vencimento = ?, quantidade_lote = ? WHERE id_lote = ?';
        const values = [dados.DataVencimento, dados.Quantidade, id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    /**
     * Remove um lote de estoque pelo seu ID.
     * @param id - ID do lote a ser deletado.
     * @returns Promise com o resultado da operação de exclusão.
     */
    async deletarLote(id: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM lote_estoque WHERE id_lote = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}
