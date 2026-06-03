import { db } from "../database/connection.database";
import { Categoria } from "../models/categoria.model";
import { ResultSetHeader } from "mysql2";

export class CategoriaRepository {
    async selectTodos(): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM categorias';
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }
    async selectById(id: number): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM categorias WHERE id_categoria = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
    async adicionarCategoria(dados: Categoria): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO categorias (dc_categoria) VALUES (?);';
        const values = [dados.DescricaoCategoria];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async editarCategoria(id: number, dados: Categoria): Promise<ResultSetHeader> {
        const sql = 'UPDATE categorias SET dc_categoria = ? WHERE id_categoria = ?;';
        const values = [dados.DescricaoCategoria, id]
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows
    }

    async deletarCategoria(id: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM categorias WHERE id_categoria = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}