CREATE DATABASE stockplus_db;

USE StockPlus_db;

CREATE TABLE IF NOT EXISTS Categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    dc_categoria TEXT
);

CREATE TABLE IF NOT EXISTS Fornecedores (
    id_fornecedor INT PRIMARY KEY AUTO_INCREMENT,
    dc_fornecedor TEXT
);

CREATE TABLE IF NOT EXISTS Produtos (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    dc_produto TEXT,
    vinculo_imagem VARCHAR(100),
    preco DECIMAL(10, 2) NOT NULL,
    estoque_minimo INT NOT NULL,
    id_categoria INT NOT NULL,
    id_fornecedor INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores (id_fornecedor)
);

CREATE TABLE IF NOT EXISTS Estoque (
    id_estoque INT PRIMARY KEY AUTO_INCREMENT,
    id_produto INT NOT NULL,
    quantidade_atual INT NOT NULL,
    dt_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Lote_Estoque (
    id_lote INT PRIMARY KEY AUTO_INCREMENT,
    id_produto INT NOT NULL,
    dt_vencimento DATE,
    quantidade_lote INT,
    dt_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Movimentacao (
    id_movimentacao INT PRIMARY KEY AUTO_INCREMENT,
    tipo_movimento ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    dt_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_lote INT,
    id_produto INT,
    FOREIGN KEY (id_lote) REFERENCES Lote_Estoque (id_lote) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto) ON DELETE CASCADE
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Atualiza quantidade_atual em Estoque ao inserir uma Movimentacao.
-- ENTRADA soma a quantidade; SAIDA subtrai.
-- A trigger tambem atualiza dt_ultima_atualizacao do registro de estoque.
DELIMITER $$

CREATE TRIGGER trg_movimentacao_atualiza_estoque
AFTER INSERT ON Movimentacao
FOR EACH ROW
BEGIN
    IF NEW.tipo_movimento = 'ENTRADA' THEN
        UPDATE Estoque
        SET
            quantidade_atual       = quantidade_atual + NEW.quantidade,
            dt_ultima_atualizacao  = CURRENT_TIMESTAMP
        WHERE id_produto = NEW.id_produto;

    ELSEIF NEW.tipo_movimento = 'SAIDA' THEN
        UPDATE Estoque
        SET
            quantidade_atual       = quantidade_atual - NEW.quantidade,
            dt_ultima_atualizacao  = CURRENT_TIMESTAMP
        WHERE id_produto = NEW.id_produto;
    END IF;
END$$

DELIMITER;

-- ============================================================
-- DADOS INICIAIS (comentados — descomentar para popular o banco)
-- ============================================================

-- INSERT INTO
--     Categorias (dc_categoria)
-- VALUES ('Bebidas'),
--     ('Alimentos'),
--     ('Limpeza'),
--     ('Higiene Pessoal');

-- INSERT INTO
--     Fornecedores (dc_fornecedor)
-- VALUES ('Fornecedor A'),
--     ('Fornecedor B'),
--     ('Fornecedor C'),
--     ('Fornecedor D');

-- INSERT INTO
--     Produtos (
--         dc_produto,
--         vinculo_imagem,
--         preco,
--         estoque_minimo,
--         id_categoria,
--         id_fornecedor
--     )
-- VALUES (
--         'Coca-Cola',
--         'coca-cola.jpg',
--         5.99,
--         10,
--         1,
--         1
--     ),
--     (
--         'Arroz',
--         'arroz.jpg',
--         20.00,
--         50,
--         2,
--         2
--     ),
--     (
--         'Detergente',
--         'detergente.jpg',
--         3.50,
--         15,
--         3,
--         3
--     ),
--     (
--         'Shampoo',
--         'shampoo.jpg',
--         12.00,
--         20,
--         4,
--         4
--     );

-- INSERT INTO
--     Estoque (id_produto, quantidade_atual)
-- VALUES (1, 100),
--     (2, 200),
--     (3, 150),
--     (4, 80);

-- Insert into
--     Lote_Estoque (
--         id_produto,
--         dt_vencimento,
--         quantidade_lote
--     )
-- values (1, '2026-12-31', 50),
--     (1, '2025-01-31', 50),
--     (2, '2026-06-30', 100),
--     (2, '2025-07-31', 100),
--     (3, '2026-11-30', 75),
--     (3, '2026-12-31', 75),
--     (4, '2026-03-31', 40),
--     (4, '2026-04-30', 40);

-- INSERT INTO
--     Movimentacao (
--         tipo_movimento,
--         quantidade,
--         id_lote,
--         id_produto
--     )
-- VALUES ('ENTRADA', 50, 1, 1),
--     ('ENTRADA', 50, 2, 1),
--     ('ENTRADA', 100, 3, 2),
--     ('ENTRADA', 100, 4, 2),
--     ('ENTRADA', 75, 5, 3),
--     ('ENTRADA', 75, 6, 3),
--     ('ENTRADA', 40, 7, 4),
--     ('ENTRADA', 40, 8, 4);

create view relatorio_estoque as
SELECT
    p.id_produto,
    p.dc_produto,
    p.preco,
    p.estoque_minimo,
    c.dc_categoria,
    f.dc_fornecedor,
    COALESCE(e.quantidade_atual, 0) AS quantidade_atual,
    e.dt_ultima_atualizacao,
    COALESCE(SUM(l.quantidade_lote), 0) AS total_em_lotes,
    MIN(l.dt_vencimento) AS proximo_vencimento,
    ROUND(
        p.preco * COALESCE(e.quantidade_atual, 0),
        2
    ) AS valor_total_estoque,
    CASE
        WHEN COALESCE(e.quantidade_atual, 0) <= 0 THEN 'SEM_ESTOQUE'
        WHEN COALESCE(e.quantidade_atual, 0) <= p.estoque_minimo THEN 'ESTOQUE_BAIXO'
        ELSE 'NORMAL'
    END AS status_estoque
FROM
    Produtos p
    INNER JOIN Categorias c ON c.id_categoria = p.id_categoria
    INNER JOIN Fornecedores f ON f.id_fornecedor = p.id_fornecedor
    LEFT JOIN Estoque e ON e.id_produto = p.id_produto
    LEFT JOIN Lote_Estoque l ON l.id_produto = p.id_produto
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
        WHEN COALESCE(e.quantidade_atual, 0) <= 0 THEN 0
        WHEN COALESCE(e.quantidade_atual, 0) <= p.estoque_minimo THEN 1
        ELSE 2
    END,
    p.dc_produto ASC;

CREATE VIEW estoqueSelect as
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
    e.quantidade_atual ASC;

-- O filtro por id_estoque é aplicado no código (WHERE id_estoque = ?).
-- Views não aceitam parâmetros — o WHERE foi removido daqui.
CREATE VIEW estoqueID as
SELECT
    e.*,
    p.estoque_minimo,
    CASE
        WHEN e.quantidade_atual <= p.estoque_minimo THEN 'ESTOQUE BAIXO'
        ELSE 'OK'
    END AS status_estoque
FROM Estoque e
    INNER JOIN produtos p ON p.id_produto = e.id_produto;