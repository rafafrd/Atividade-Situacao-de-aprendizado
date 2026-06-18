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
        await conn.query(`DROP DATABASE IF EXISTS \`${EnvVar.DB_DATABASE}\``);
        await conn.end();
        res.json({ ok: true, mensagem: "Banco dropado. Reinicie o serviço." });
    } catch (error) {
        res.status(500).json({ ok: false, error: String(error) });
    }
});

app.use('/', router);

app.use('/produtos', express.static(path.resolve('uploads/Images')));

initializeDatabase().then(() => {
    app.listen(EnvVar.SERVER_PORT, () => {
        console.log(`Servidor rodando em http://localhost:${EnvVar.SERVER_PORT}`);
    });
}).catch((error) => {
    console.error('Falha ao inicializar o banco de dados:', error);
    process.exit(1);
});