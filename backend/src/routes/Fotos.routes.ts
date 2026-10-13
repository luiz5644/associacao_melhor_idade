import { Router } from "express";
import { FotosControle } from "../controle/Fotos.controle";
import { authMiddleware } from "../middleware/auth.middleware";

const fotosRoute = Router()
const fotoControle = new FotosControle()

fotosRoute
.route("/")
.get(
    async (req,res) => fotoControle.listar(req,res)
)
.post(
    authMiddleware,
    async(req,res) => fotoControle.salvar(req,res)
)

fotosRoute
.route("/:id")
.get(
    async(req,res) => fotoControle.buscarPorId(req,res)
)
.put(
    authMiddleware,
    async(req,res)=> fotoControle.atualizar(req,res)
)
.delete(
    authMiddleware,
    async(req,res) => fotoControle.deletar(req,res)
)

export default fotosRoute
