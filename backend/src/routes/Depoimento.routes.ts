import { Router } from "express";
import { DepoimentoControle } from "../controle/Depoimento.controle";

const depoimentoRouter = Router()
const depoimentoControle = new DepoimentoControle()

depoimentoRouter
.route("/")
.get(
    async (req,res) => depoimentoControle.listar(req,res)
)
.post(
    async (req,res) => depoimentoControle.salvar(req,res)
)

depoimentoRouter
.route("/:id")
.get(
    async (req,res) => depoimentoControle.buscarPorId(req,res)

)
.put(
    async (req,res) => depoimentoControle.atualizar(req,res)
)
.delete(
    async (req,res) => depoimentoControle.deletar(req,res)
)

export default depoimentoRouter