import { Router } from "express";
import { CategoriaControle } from "../controle/Categoria.controle";


const categoriaRouter = Router()
const categoriaControle = new CategoriaControle()


categoriaRouter
  .route("/")
  .get(
    async (req, res) => categoriaControle.listar(req,res)
  
   )
   .post(
    async (req,res) => categoriaControle.salvar(req,res)
   )
categoriaRouter 
  .route("/:id")
  .get(
    async (req, res) => categoriaControle.buscarPorId(req,res)
  )
  .put(
    async (req, res) => categoriaControle.atualizar(req,res)
  )
  .delete(
    async (req,res) => categoriaControle.deletar(req,res)
  )
  
  export default categoriaRouter