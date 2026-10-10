import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Configura o dotenv para ler a pasta src/config
dotenv.config({ path: path.resolve(__dirname, "..", "config", ".env") });

export const conexao = createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});