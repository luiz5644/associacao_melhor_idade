import { Router } from "express";
import { AcoesControle } from "../controle/Acoes.controle";

const AcaoRouter = Router()
const acaoControle = new AcoesControle()

AcaoRouter
.route("/")
.get(
    async (req,res) => acaoControle.listar(req,res)
)
.post(
    async (req,res) => acaoControle.salvar(req,res)
)

AcaoRouter
.route("/:id")
.get(
    async(req,res) => acaoControle.buscarPorId(req,res)
)
.put(
    async (req,res) => acaoControle.atualizar(req,res)
)
.delete(
    async(req,res) => acaoControle.deletar(req,res)
)

export default AcaoRouter