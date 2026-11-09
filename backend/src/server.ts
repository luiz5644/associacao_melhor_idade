import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from 'cors';

// Carrega variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, "config", ".env") });
dotenv.config();

// Validação de variáveis obrigatórias
if (!process.env.JWT_SECRET) {
  console.error("ERRO FATAL: Variável de ambiente JWT_SECRET não está definida. Configure-a no arquivo .env antes de iniciar o servidor.");
  process.exit(1);
}

import routes from "./routes";

const app = express();

// Configuração flexível de CORS
const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map(url => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const isDev = process.env.NODE_ENV !== "production";

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, "");

    if (configuredOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    if (isDev) {
      const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin);
      if (isLocal) {
        return callback(null, true);
      }
    }

    return callback(new Error(`Bloqueado pelo CORS: origem ${origin} não permitida.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Log de requisições sem imprimir dados sensíveis ou corpo (req.body)
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode}`);
  });
  next();
});

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use(routes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}!`);
});
