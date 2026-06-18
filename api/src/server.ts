import express from "express";
import { EnvVar } from "./config/EnvVar";
import path from 'node:path';
import router from "./routes/routes";
import { initializeDatabase } from "./database/connection.database";
import mysql from "mysql2/promise";

const app = express();

app.use(express.json());

// ENDPOINT TEMPORÁRIO — remover após usar
app.get('/admin/reset-db', async (req, res) => {
    try {
        const conn = await mysql.createConnection({
            host: EnvVar.DB_HOST,
            user: EnvVar.DB_USER,
            password: EnvVar.DB_PASS,
            port: EnvVar.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        await conn.query(`USE \`${EnvVar.DB_DATABASE}\``);
        await conn.query(`SET FOREIGN_KEY_CHECKS = 0`);

        // Dropa ambas as versões (PascalCase e lowercase)
        const tabelas = [
            'Movimentacao', 'movimentacao',
            'Lote_Estoque', 'lote_estoque',
            'Estoque',      'estoque',
            'Produtos',     'produtos',
            'Fornecedores', 'fornecedores',
            'Categorias',   'categorias',
            'login'
        ];

        for (const tabela of tabelas) {
            await conn.query(`DROP TABLE IF EXISTS \`${tabela}\``);
        }

        await conn.query(`SET FOREIGN_KEY_CHECKS = 1`);
        await conn.end();

        res.json({ ok: true, mensagem: "Tabelas dropadas. Faça redeploy agora." });
    } catch (error) {
        res.status(500).json({ ok: false, error: String(error) });
    }
});

app.use('/', router);
app.use('/produtos', express.static(path.resolve('uploads/Images')));

app.listen(EnvVar.SERVER_PORT, () => {
    console.log(`Servidor rodando em http://localhost:${EnvVar.SERVER_PORT}`);

    initializeDatabase().catch((error) => {
        console.error('Falha ao inicializar o banco de dados:', error);
    });
});