import { Router } from "express";
import { AcoesControle } from "../controle/Acoes.controle";
import { authMiddleware } from "../middleware/auth.middleware";

const AcaoRouter = Router()
const acaoControle = new AcoesControle()

AcaoRouter
.route("/")
.get(
    async (req,res) => acaoControle.listar(req,res)
)
.post(
    authMiddleware,
    async (req,res) => acaoControle.salvar(req,res)
)

AcaoRouter
.route("/:id")
.get(
    async(req,res) => acaoControle.buscarPorId(req,res)
)
.put(
    authMiddleware,
    async (req,res) => acaoControle.atualizar(req,res)
)
.delete(
    authMiddleware,
    async(req,res) => acaoControle.deletar(req,res)
)

export default AcaoRouter
