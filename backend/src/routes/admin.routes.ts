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
        authMiddleware,
        async (req, res) => {
            return adminControle.salvar(req, res);
        }
    );
adminRoutes
   .post("/login",
     async (req,res) => adminControle.login(req,res)

   )

adminRoutes
.route("/recuperar-senha",)
.post(
    async (req,res) => adminControle.solicitarRecuperacaoSenha(req,res)
)

adminRoutes
.route("/redefinir-senha",)
.post(
    async (req,res) => adminControle.redefinirSenha(req,res)
)

adminRoutes
.route("/testar-email")
.get(
    authMiddleware,
    async(req,res) => adminControle.testarEmail(req,res)
)
adminRoutes
   .route("/:id")
   .get(authMiddleware, async (req,res) => adminControle.buscarporId(req,res))
   .put(authMiddleware, async (req,res) => adminControle.atualizar(req,res))
   .delete(authMiddleware, async (req,res) => adminControle.deletar(req,res))



export default adminRoutes