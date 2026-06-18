import { db } from '../database/connection.database';
import { movimentacao } from '../models/movimentacao.model';
import { ResultSetHeader } from 'mysql2';

export class movimentacaoRepository {

    async selectTodos(): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM movimentacao';
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }

    async selectById(id: number): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM movimentacao WHERE id_movimentacao = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async adicionarmovimentacao(dados: movimentacao): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO movimentacao (tipo_movimento, quantidade, id_lote, id_produto) VALUES (?, ?, ?, ?)';
        const values = [dados.TipoMovimento, dados.Quantidade, dados.IdLote, dados.IdProduto];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async editarmovimentacao(id: number, dados: movimentacao): Promise<ResultSetHeader> {
        const sql = 'UPDATE movimentacao SET tipo_movimento = ?, quantidade = ?, id_lote = ?, id_produto = ? WHERE id_movimentacao = ?';
        const values = [dados.TipoMovimento, dados.Quantidade, dados.IdLote, dados.IdProduto, id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async deletarmovimentacao(id: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM movimentacao WHERE id_movimentacao = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}
