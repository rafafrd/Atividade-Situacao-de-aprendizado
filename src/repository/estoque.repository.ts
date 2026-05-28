import { db } from '../database/connection.database';
import { Estoque } from '../models/estoque.model';
import { ResultSetHeader } from 'mysql2';

export class EstoqueRepository {

    /**
     * Retorna todos os registros da tabela Estoque.
     * @returns Promise com os dados de todos os estoques.
     */
    async selectTodos(): Promise<ResultSetHeader> {
        const sql = `
            SELECT
                e.*,
                p.estoque_minimo,
                CASE
                    WHEN e.quantidade_atual <= p.estoque_minimo THEN 'ESTOQUE BAIXO'
                    ELSE 'OK'
                END AS status_estoque
            FROM Estoque e
            INNER JOIN produtos p ON p.id_produto = e.id_produto
            ORDER BY
                CASE
                    WHEN e.quantidade_atual <= p.estoque_minimo THEN 0
                    ELSE 1
                END,
                e.quantidade_atual ASC
        `;
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }

    /**
     * Retorna um registro de estoque pelo seu ID.
     * @param id - ID do estoque a ser buscado.
     * @returns Promise com os dados do estoque encontrado.
     */
    async selectById(id: number): Promise<ResultSetHeader> {
        const sql = `
            SELECT
                e.*,
                p.estoque_minimo,
                CASE
                    WHEN e.quantidade_atual <= p.estoque_minimo THEN 'ESTOQUE BAIXO'
                    ELSE 'OK'
                END AS status_estoque
            FROM Estoque e
            INNER JOIN produtos p ON p.id_produto = e.id_produto
            WHERE e.id_estoque = ?
        `;
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    /**
     * Insere um novo registro de estoque no banco de dados.
     * @param dados - Instância de Estoque com os dados a serem inseridos.
     * @returns Promise com o resultado da operação de inserção.
     */
    async adicionarEstoque(dados: Estoque): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO Estoque (id_produto, quantidade_atual) VALUES (?, ?)';
        const values = [dados.IdProduto, dados.QuantidadeAtual];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    /**
     * Atualiza a quantidade e a data de atualização de um registro de estoque.
     * @param id - ID do estoque a ser atualizado.
     * @param dados - Instância de Estoque com os novos dados.
     * @returns Promise com o resultado da operação de atualização.
     */
    async editarEstoque(id: number, dados: Estoque): Promise<ResultSetHeader> {
        const sql = 'UPDATE Estoque SET quantidade_atual = ?, dt_ultima_atualizacao = CURRENT_TIMESTAMP WHERE id_estoque = ?';
        const values = [dados.QuantidadeAtual, id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    /**
     * Remove um registro de estoque pelo seu ID.
     * @param id - ID do estoque a ser deletado.
     * @returns Promise com o resultado da operação de exclusão.
     */
    async deletarEstoque(id: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM Estoque WHERE id_estoque = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async relatorioEstoque(): Promise<ResultSetHeader> {
        const sql = `
            SELECT
                p.id_produto,
                p.dc_produto,
                p.preco,
                p.estoque_minimo,
                c.dc_categoria,
                f.dc_fornecedor,
                COALESCE(e.quantidade_atual, 0)      AS quantidade_atual,
                e.dt_ultima_atualizacao,
                COALESCE(SUM(l.quantidade_lote), 0)  AS total_em_lotes,
                MIN(l.dt_vencimento)                 AS proximo_vencimento,
                ROUND(p.preco * COALESCE(e.quantidade_atual, 0), 2) AS valor_total_estoque,
                CASE
                    WHEN COALESCE(e.quantidade_atual, 0) <= 0              THEN 'SEM_ESTOQUE'
                    WHEN COALESCE(e.quantidade_atual, 0) <= p.estoque_minimo THEN 'ESTOQUE_BAIXO'
                    ELSE 'NORMAL'
                END AS status_estoque
            FROM Produtos p
            INNER JOIN Categorias   c ON c.id_categoria  = p.id_categoria
            INNER JOIN Fornecedores f ON f.id_fornecedor = p.id_fornecedor
            LEFT  JOIN Estoque      e ON e.id_produto    = p.id_produto
            LEFT  JOIN Lote_Estoque l ON l.id_produto    = p.id_produto
            GROUP BY
                p.id_produto,
                p.dc_produto,
                p.preco,
                p.estoque_minimo,
                c.dc_categoria,
                f.dc_fornecedor,
                e.quantidade_atual,
                e.dt_ultima_atualizacao
            ORDER BY
                CASE
                    WHEN COALESCE(e.quantidade_atual, 0) <= 0               THEN 0
                    WHEN COALESCE(e.quantidade_atual, 0) <= p.estoque_minimo THEN 1
                    ELSE 2
                END,
                p.dc_produto ASC
        `;
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }
}
