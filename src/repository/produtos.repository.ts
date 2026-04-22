import { db } from '../database/connection.database';
import { Produto } from '../models/produtos.model';
import { ResultSetHeader } from 'mysql2';

export class ProdutosRepository {

    async selectTodos(): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM produtos';
        const [rows] = await db.execute<ResultSetHeader>(sql);
        return rows;
    }

    async selectById(id: number): Promise<ResultSetHeader> {
        const sql = 'SELECT * FROM produtos WHERE id_produto = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async adicionarProduto(dados: Produto): Promise<ResultSetHeader> {
        const sql = 'INSERT INTO produtos (dc_produto, vinculo_imagem, preco, estoque_minimo, id_categoria, id_fornecedor) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [dados.DescricaoProduto, dados.VinculoImagem, dados.Preco, dados.EstoqueMinimo, dados.IdCategoria, dados.IdFornecedor];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async editarProduto(id: number, dados: Produto): Promise<ResultSetHeader> {
        const sql = 'UPDATE produtos SET dc_produto = ?, vinculo_imagem = ?, preco = ?, estoque_minimo = ?, id_categoria = ?, id_fornecedor = ? WHERE id_produto = ?';
        const values = [dados.DescricaoProduto, dados.VinculoImagem, dados.Preco, dados.EstoqueMinimo, dados.IdCategoria, dados.IdFornecedor, id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }

    async deletarProduto(id: number): Promise<ResultSetHeader> {
        const sql = 'DELETE FROM produtos WHERE id_produto = ?';
        const values = [id];
        const [rows] = await db.execute<ResultSetHeader>(sql, values);
        return rows;
    }
}
