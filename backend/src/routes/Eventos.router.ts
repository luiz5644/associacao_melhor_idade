import { Router } from "express";
import { EventosControle } from "../controle/Eventos.controle";
const eventosRouter = Router()
const eventosControle = new EventosControle()

eventosRouter
  .route("/")
  .get(
    async (req,res) => eventosControle.listar(req,res)
  )
  .post(
    async (req,res) => eventosControle.salvar(req,res)
  )

eventosRouter
 .route("/:id")
 .get(
    async (req, res) => eventosControle.buscarporId(req,res)
 )
 .put(
    async(req,res) =>eventosControle.atualizar(req,res)
 )
 .delete(
    async (req,res) => eventosControle.deletar(req,res)
 )

 export default eventosRouter

