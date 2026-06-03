import { db } from '../database/connection.database';
import { Movimentacao } from '../models/movimentacao.model';
import { ResultSetHeader } from 'mysql2';

export class MovimentacaoRepository {

    async selectTodos(): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM Movimentacao';
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }

    async selectById(id: number): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM Movimentacao WHERE id_movimentacao = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async adicionarMovimentacao(dados: Movimentacao): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO Movimentacao (tipo_movimento, quantidade, id_lote, id_produto) VALUES (?, ?, ?, ?)';
        const values = [dados.TipoMovimento, dados.Quantidade, dados.IdLote, dados.IdProduto];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async editarMovimentacao(id: number, dados: Movimentacao): Promise<ResultSetHeader> {
        const sql = 'UPDATE Movimentacao SET tipo_movimento = ?, quantidade = ?, id_lote = ?, id_produto = ? WHERE id_movimentacao = ?';
        const values = [dados.TipoMovimento, dados.Quantidade, dados.IdLote, dados.IdProduto, id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async deletarMovimentacao(id: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM Movimentacao WHERE id_movimentacao = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}
