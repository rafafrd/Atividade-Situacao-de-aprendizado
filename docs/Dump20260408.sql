-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: stockplus_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `dc_categoria` text,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornecedores`
--

DROP TABLE IF EXISTS `fornecedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedores` (
  `id_fornecedor` int NOT NULL AUTO_INCREMENT,
  `dc_fornecedor` text,
  PRIMARY KEY (`id_fornecedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedores`
--

LOCK TABLES `fornecedores` WRITE;
/*!40000 ALTER TABLE `fornecedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `fornecedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `dc_produto` text,
  `vinculo_imagem` varchar(100) DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `estoque_minimo` int NOT NULL,
  `id_categoria` int NOT NULL,
  `id_fornecedor` int NOT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_fornecedor` (`id_fornecedor`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `produtos_ibfk_2` FOREIGN KEY (`id_fornecedor`) REFERENCES `fornecedores` (`id_fornecedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estoque`
--

DROP TABLE IF EXISTS `estoque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estoque` (
  `id_estoque` int NOT NULL AUTO_INCREMENT,
  `id_produto` int NOT NULL,
  `quantidade_atual` int NOT NULL,
  `dt_ultima_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_estoque`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `estoque_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estoque`
--

LOCK TABLES `estoque` WRITE;
/*!40000 ALTER TABLE `estoque` DISABLE KEYS */;
/*!40000 ALTER TABLE `estoque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lote_estoque`
--

DROP TABLE IF EXISTS `lote_estoque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lote_estoque` (
  `id_lote` int NOT NULL AUTO_INCREMENT,
  `id_produto` int NOT NULL,
  `dt_vencimento` date DEFAULT NULL,
  `quantidade_lote` int DEFAULT NULL,
  `dt_entrada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_lote`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `lote_estoque_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lote_estoque`
--

LOCK TABLES `lote_estoque` WRITE;
/*!40000 ALTER TABLE `lote_estoque` DISABLE KEYS */;
/*!40000 ALTER TABLE `lote_estoque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimentacao`
--

DROP TABLE IF EXISTS `movimentacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimentacao` (
  `id_movimentacao` int NOT NULL AUTO_INCREMENT,
  `tipo_movimento` enum('ENTRADA','SAIDA') NOT NULL,
  `quantidade` int NOT NULL,
  `dt_movimentacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_lote` int DEFAULT NULL,
  `id_produto` int DEFAULT NULL,
  PRIMARY KEY (`id_movimentacao`),
  KEY `id_lote` (`id_lote`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `movimentacao_ibfk_1` FOREIGN KEY (`id_lote`) REFERENCES `lote_estoque` (`id_lote`) ON DELETE CASCADE,
  CONSTRAINT `movimentacao_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimentacao`
--

LOCK TABLES `movimentacao` WRITE;
/*!40000 ALTER TABLE `movimentacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimentacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Trigger: trg_movimentacao_atualiza_estoque
--

DELIMITER $$

CREATE TRIGGER `trg_movimentacao_atualiza_estoque`
AFTER INSERT ON `movimentacao`
FOR EACH ROW
BEGIN
    IF NEW.tipo_movimento = 'ENTRADA' THEN
        UPDATE `estoque`
        SET
            quantidade_atual      = quantidade_atual + NEW.quantidade,
            dt_ultima_atualizacao = CURRENT_TIMESTAMP
        WHERE id_produto = NEW.id_produto;

    ELSEIF NEW.tipo_movimento = 'SAIDA' THEN
        UPDATE `estoque`
        SET
            quantidade_atual      = quantidade_atual - NEW.quantidade,
            dt_ultima_atualizacao = CURRENT_TIMESTAMP
        WHERE id_produto = NEW.id_produto;
    END IF;
END$$

DELIMITER ;

--
-- View: relatorio_estoque
--

CREATE OR REPLACE VIEW `relatorio_estoque` AS
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
    ROUND(p.preco * COALESCE(e.quantidade_atual, 0), 2) AS valor_total_estoque,
    CASE
        WHEN COALESCE(e.quantidade_atual, 0) <= 0               THEN 'SEM_ESTOQUE'
        WHEN COALESCE(e.quantidade_atual, 0) <= p.estoque_minimo THEN 'ESTOQUE_BAIXO'
        ELSE 'NORMAL'
    END AS status_estoque
FROM `produtos` p
INNER JOIN `categorias`    c ON c.id_categoria  = p.id_categoria
INNER JOIN `fornecedores`  f ON f.id_fornecedor = p.id_fornecedor
LEFT  JOIN `estoque`       e ON e.id_produto    = p.id_produto
LEFT  JOIN `lote_estoque`  l ON l.id_produto    = p.id_produto
GROUP BY
    p.id_produto, p.dc_produto, p.preco, p.estoque_minimo,
    c.dc_categoria, f.dc_fornecedor,
    e.quantidade_atual, e.dt_ultima_atualizacao
ORDER BY
    CASE
        WHEN COALESCE(e.quantidade_atual, 0) <= 0                THEN 0
        WHEN COALESCE(e.quantidade_atual, 0) <= p.estoque_minimo THEN 1
        ELSE 2
    END,
    p.dc_produto ASC;

--
-- View: estoqueSelect  (usada em GET /estoque)
--

CREATE OR REPLACE VIEW `estoqueSelect` AS
SELECT
    e.*,
    p.estoque_minimo,
    CASE
        WHEN e.quantidade_atual <= p.estoque_minimo THEN 'ESTOQUE BAIXO'
        ELSE 'OK'
    END AS status_estoque
FROM `estoque` e
INNER JOIN `produtos` p ON p.id_produto = e.id_produto
ORDER BY
    CASE WHEN e.quantidade_atual <= p.estoque_minimo THEN 0 ELSE 1 END,
    e.quantidade_atual ASC;

--
-- View: estoqueID  (usada em GET /estoque/:id — filtro aplicado no código)
--

CREATE OR REPLACE VIEW `estoqueID` AS
SELECT
    e.*,
    p.estoque_minimo,
    CASE
        WHEN e.quantidade_atual <= p.estoque_minimo THEN 'ESTOQUE BAIXO'
        ELSE 'OK'
    END AS status_estoque
FROM `estoque` e
INNER JOIN `produtos` p ON p.id_produto = e.id_produto;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump updated on 2026-05-28
