import { db } from "../database/connection.database";
import { Fornecedores } from "../models/fornecedores.model";
import { ResultSetHeader } from "mysql2";

export class FornecedoresRepository {
    async selectTodos(): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM fornecedores';
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }
    async selectById(id: number): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM fornecedores WHERE id_fornecedor = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
    async adicionarFornecedor(dados: Fornecedores): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO fornecedores (dc_fornecedor) VALUES (?);';
        const values = [dados.DescricaoFornecedor];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async editarFornecedor(id: number, dados: Fornecedores): Promise<ResultSetHeader> {
        const sql = 'UPDATE fornecedores SET dc_fornecedor = ? WHERE id_fornecedor = ?;';
        const values = [dados.DescricaoFornecedor, id]
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows
    }

    async deletarFornecedor(id: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM fornecedores WHERE id_fornecedor = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}