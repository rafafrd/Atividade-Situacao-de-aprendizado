import { db } from '../database/connection.database';
import { Estoque } from '../models/estoque.model';
import { ResultSetHeader } from 'mysql2';

export class EstoqueRepository {

    /**
     * Retorna todos os registros da tabela Estoque.
     * @returns Promise com os dados de todos os estoques.
     */
    async selectTodos(): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM Estoque';
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }

    /**
     * Retorna um registro de estoque pelo seu ID.
     * @param id - ID do estoque a ser buscado.
     * @returns Promise com os dados do estoque encontrado.
     */
    async selectById(id: number): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM Estoque WHERE id_estoque = ?';
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
}
