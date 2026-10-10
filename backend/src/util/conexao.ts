import { createPool } from "mysql2/promise";

export const conexao = createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "associacao_melhor_idade"
});