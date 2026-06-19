import express from "express";
import { EnvVar } from "./config/EnvVar";
import path from 'node:path';
import router from "./routes/routes";
import { initializeDatabase } from "./database/connection.database";

const app = express();

app.use(express.json());
app.use('/produtos', express.static(path.resolve('uploads/Images')));
app.use('/', router);

initializeDatabase().then(() => {
    app.listen(EnvVar.SERVER_PORT, () => {
        console.log(`Servidor rodando em http://localhost:${EnvVar.SERVER_PORT}`);
    });
}).catch((error) => {
    console.error('Falha ao inicializar o banco de dados:', error);
    process.exit(1);
});