import { Router } from "express";
import { AlbumControle } from "../controle/Album.controle";

const AlbumRouter = Router()
const albumControle = new AlbumControle()

AlbumRouter
.route("/")
.get(
    async (req,res) => albumControle.listar(req,res)
)
.post(
    async (req,res) => albumControle.salvar(req,res)
)

AlbumRouter
.route("/:id")
.get(
    async (req,res) => albumControle.buscarporId(req,res)
)
.put(
    async (req,res) => albumControle.atualizar(req,res)
)
.delete(
    async (req,res) => albumControle.deletar(req,res)
)

export default AlbumRouter