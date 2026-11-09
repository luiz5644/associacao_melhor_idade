import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import { conexao } from "./util/conexao";
import { logErro } from "./util/logger";

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
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(cors({
  origin: (origin, callback) => {
    // Sem Origin (curl, Postman, requisições do próprio servidor): permitido
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, "");
    if (configuredOrigins.includes(cleanOrigin)) return callback(null, true);
    // Fora de produção, qualquer porta em localhost/127.0.0.1
    if (isDev && localhostRegex.test(cleanOrigin)) return callback(null, true);
    // Origem não permitida: sem cabeçalhos CORS, o navegador bloqueia (sem stack trace)
    return callback(null, false);
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

app.get('/health/db', async (_req, res) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      conexao.query('SELECT 1'),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), 3000);
      }),
    ]);
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    logErro('Health check do banco', error);
    return res.status(503).json({ status: 'indisponivel' });
  } finally {
    if (timer) clearTimeout(timer);
  }
});

app.use(routes);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logErro('Erro não tratado', err);

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido' });
  }

  const status = Number(err?.status ?? err?.statusCode);
  if (Number.isInteger(status) && status >= 400 && status < 500) {
    return res.status(status).json({ message: 'Requisição inválida' });
  }

  return res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}!`);
});
