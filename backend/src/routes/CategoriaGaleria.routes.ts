import { Router } from "express";
import { CategoriaGaleriaControle } from "../controle/CategoriaGaleria.controle";

const categoriaRoutes = Router()
const categoriaGaleriaControle = new CategoriaGaleriaControle()

categoriaRoutes
.route("/")
.get(
    async(req,res) => categoriaGaleriaControle.listar(req,res)
)
.post(
    async (req,res) => categoriaGaleriaControle.salvar(req,res)
    
)

categoriaRoutes
.route("/:id")
.get(
    async(req,res) => categoriaGaleriaControle.buscarporId(req,res)
)
.put(
    async(req,res) =>  categoriaGaleriaControle.atualizar(req,res)
)
.delete(
    async(req,res) => categoriaGaleriaControle.deletar(req,res)
)

export default categoriaRoutes