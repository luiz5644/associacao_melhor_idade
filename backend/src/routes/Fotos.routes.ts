import { Router } from "express";
import { FotosControle } from "../controle/Fotos.controle";

const fotosRoute = Router()
const fotoControle = new FotosControle()

fotosRoute
.route("/")
.get(
    async (req,res) => fotoControle.listar(req,res)
)
.post(
    async(req,res) => fotoControle.salvar(req,res)
)

fotosRoute
.route("/:id")
.get(
    async(req,res) => fotoControle.buscarPorId(req,res)
)
.put(
    async(req,res)=> fotoControle.atualizar(req,res)
)
.delete(
    async(req,res) => fotoControle.deletar(req,res)
)

export default fotosRoute