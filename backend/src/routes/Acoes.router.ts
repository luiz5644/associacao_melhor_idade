import { Router } from "express";
import { AcoesControle } from "../controle/Acoes.controle";
const acoesRouter = Router()
const acoesControle = new AcoesControle()

acoesRouter
  .route("/")
  .get(
    async (req,res) => acoesControle.listar(req,res)
  )
  .post(
    async (req,res) => acoesControle.salvar(req,res)
  )

acoesRouter
 .route("/:id")
 .get(
    async (req, res) => acoesControle.buscarporId(req,res)
 )
 .put(
    async(req,res) =>acoesControle.atualizar(req,res)
 )
 .delete(
    async (req,res) => acoesControle.deletar(req,res)
 )

 export default acoesRouter

