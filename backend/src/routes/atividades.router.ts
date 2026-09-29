import { Router } from "express";
import { AtividadeControle } from "../controle/atividade.controle";

const AtividadeRouter = Router()
const atividadeControle = new AtividadeControle()

AtividadeRouter
  .route("/")
  .get(
    async (req,res) => atividadeControle.listar(req,res)
  )
  .post(
    async (req,res) => atividadeControle.salvar(req,res)
  )

AtividadeRouter
 .route("/:id")
 .get(
    async (req, res) => atividadeControle.buscarporId(req,res)
 )
 .put(
    async(req,res) => atividadeControle.atualizar(req,res)
 )
 .delete(
    async (req,res) => atividadeControle.deletar(req,res)
 )
 
 AtividadeRouter
  .route("/categoria/:id")
  .get(
    async (req,res) => atividadeControle.listarporCategoria(req,res)
 )
 export default AtividadeRouter

