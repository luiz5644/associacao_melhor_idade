import { Router } from "express";
import { InformacoesControle } from "../controle/Informacoes.controle";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const controle = new InformacoesControle();
router.get("/", (req, res) => controle.get(req, res));
router.put("/", authMiddleware, (req, res) => controle.update(req, res));
export default router;
