import "reflect-metadata";
import express from "express";
import routes from "./routes";
import cors from 'cors';
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log("========== REQUISIÇÃO ==========");
    console.log("Método:", req.method);
    console.log("URL:", req.url);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
    console.log("================================");

    next();
});

app.use(routes);

app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000!");
});