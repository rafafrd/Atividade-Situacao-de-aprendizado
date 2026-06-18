import mysql, { Pool } from 'mysql2/promise';
import { EnvVar } from '../config/EnvVar';

class Database {
    private static instance: Database;
    private pool!: Pool;

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
            Database.instance.createPool();
        }
        return Database.instance;
    }

    private createPool(): void {
        this.pool = mysql.createPool({
            host: EnvVar.DB_HOST,
            user: EnvVar.DB_USER,
            password: EnvVar.DB_PASS,
            database: EnvVar.DB_DATABASE,
            port: EnvVar.DB_PORT,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }

    public getPool(): Pool {
        return this.pool;
    }
}

export const db = Database.getInstance().getPool();

export async function initializeDatabase(): Promise<void> {
    console.log('Inicializando o banco de dados e tabelas...');
    try {
        const tempConnection = await mysql.createConnection({
            host: EnvVar.DB_HOST,
            user: EnvVar.DB_USER,
            password: EnvVar.DB_PASS,
            port: EnvVar.DB_PORT,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        const dbName = EnvVar.DB_DATABASE;

        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await tempConnection.query(`USE \`${dbName}\`;`);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS login (
                login_id      INT PRIMARY KEY AUTO_INCREMENT,
                username      VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role          VARCHAR(50)  NOT NULL DEFAULT 'user',
                is_active     TINYINT(1)   NOT NULL DEFAULT 1,
                created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Categorias (
                id_categoria INT PRIMARY KEY AUTO_INCREMENT,
                dc_categoria TEXT
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Fornecedores (
                id_fornecedor INT PRIMARY KEY AUTO_INCREMENT,
                dc_fornecedor TEXT
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Produtos (
                id_produto     INT PRIMARY KEY AUTO_INCREMENT,
                dc_produto     TEXT,
                vinculo_imagem VARCHAR(100),
                preco          DECIMAL(10, 2) NOT NULL,
                estoque_minimo INT NOT NULL,
                id_categoria   INT NOT NULL,
                id_fornecedor  INT NOT NULL,
                FOREIGN KEY (id_categoria)  REFERENCES Categorias  (id_categoria),
                FOREIGN KEY (id_fornecedor) REFERENCES Fornecedores (id_fornecedor)
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Estoque (
                id_estoque            INT PRIMARY KEY AUTO_INCREMENT,
                id_produto            INT NOT NULL,
                quantidade_atual      INT NOT NULL,
                dt_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_produto) REFERENCES Produtos (id_produto) ON DELETE CASCADE
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Lote_Estoque (
                id_lote         INT PRIMARY KEY AUTO_INCREMENT,
                id_produto      INT NOT NULL,
                dt_vencimento   DATE,
                quantidade_lote INT,
                dt_entrada      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_produto) REFERENCES Produtos (id_produto) ON DELETE CASCADE
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Movimentacao (
                id_movimentacao INT PRIMARY KEY AUTO_INCREMENT,
                tipo_movimento  ENUM('ENTRADA', 'SAIDA') NOT NULL,
                quantidade      INT NOT NULL,
                dt_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                id_lote         INT,
                id_produto      INT,
                FOREIGN KEY (id_lote)    REFERENCES Lote_Estoque (id_lote)    ON DELETE CASCADE,
                FOREIGN KEY (id_produto) REFERENCES Produtos      (id_produto) ON DELETE CASCADE
            );
        `);

        await tempConnection.query(`
            CREATE OR REPLACE TRIGGER trg_movimentacao_atualiza_estoque
            AFTER INSERT ON Movimentacao
            FOR EACH ROW
            BEGIN
                IF NEW.tipo_movimento = 'ENTRADA' THEN
                    UPDATE Estoque
                    SET quantidade_atual      = quantidade_atual + NEW.quantidade,
                        dt_ultima_atualizacao = CURRENT_TIMESTAMP
                    WHERE id_produto = NEW.id_produto;
                ELSEIF NEW.tipo_movimento = 'SAIDA' THEN
                    UPDATE Estoque
                    SET quantidade_atual      = quantidade_atual - NEW.quantidade,
                        dt_ultima_atualizacao = CURRENT_TIMESTAMP
                    WHERE id_produto = NEW.id_produto;
                END IF;
            END;
        `);

        await tempConnection.query(`
            CREATE OR REPLACE VIEW relatorio_estoque AS
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
                p.id_produto, p.dc_produto, p.preco, p.estoque_minimo,
                c.dc_categoria, f.dc_fornecedor, e.quantidade_atual, e.dt_ultima_atualizacao
            ORDER BY
                CASE
                    WHEN COALESCE(e.quantidade_atual, 0) <= 0              THEN 0
                    WHEN COALESCE(e.quantidade_atual, 0) <= p.estoque_minimo THEN 1
                    ELSE 2
                END,
                p.dc_produto ASC;
        `);

        await tempConnection.query(`
            CREATE OR REPLACE VIEW estoqueSelect AS
            SELECT
                e.*,
                p.estoque_minimo,
                CASE
                    WHEN e.quantidade_atual <= p.estoque_minimo THEN 'ESTOQUE BAIXO'
                    ELSE 'OK'
                END AS status_estoque
            FROM Estoque e
            INNER JOIN Produtos p ON p.id_produto = e.id_produto
            ORDER BY
                CASE WHEN e.quantidade_atual <= p.estoque_minimo THEN 0 ELSE 1 END,
                e.quantidade_atual ASC;
        `);

        await tempConnection.query(`
            CREATE OR REPLACE VIEW estoqueID AS
            SELECT
                e.*,
                p.estoque_minimo,
                CASE
                    WHEN e.quantidade_atual <= p.estoque_minimo THEN 'ESTOQUE BAIXO'
                    ELSE 'OK'
                END AS status_estoque
            FROM Estoque e
            INNER JOIN Produtos p ON p.id_produto = e.id_produto;
        `);

        await tempConnection.end();
        console.log('Banco de dados e tabelas verificados/criados com sucesso.');
    } catch (error) {
        console.error('Erro ao criar o banco ou as tabelas:', error);
        throw error;
    }
}
