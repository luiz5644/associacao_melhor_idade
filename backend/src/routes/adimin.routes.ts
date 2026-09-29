import { Router } from "express";
import { AdminControle } from "../controle/Admin.controle";
import { authMiddleware } from "../middleware/auth.middleware";

const adminRoutes = Router()
const adminControle = new AdminControle()

adminRoutes
    .route("/")
    .get(
        authMiddleware,
        async (req, res) => adminControle.listar(req, res)
    )
    .post(
        async (req, res) => {
            console.log("BODY NA ROTA:", req.body);
            console.log("HEADERS:", req.headers);

            return adminControle.salvar(req, res);
        }
    );
adminRoutes
   .post("/login",
     async (req,res) => adminControle.login(req,res)

   )
adminRoutes
   .route("/:id")
   .get(async (req,res) => adminControle.buscarporId(req,res))
   .put(async (req,res) => adminControle.atualizar(req,res))
   .delete(async (req,res) => adminControle.deletar(req,res))

export default adminRoutes