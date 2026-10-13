import { Router } from "express";
import { PatrocinadorControle } from "../controle/Patrocinador.controle";
import { authMiddleware } from "../middleware/auth.middleware";

const patrocinadorRoutes = Router();
const controle = new PatrocinadorControle();

patrocinadorRoutes.get("/", (req, res) => controle.listar(req, res));
patrocinadorRoutes.get("/:id", (req, res) => controle.buscarPorId(req, res));
patrocinadorRoutes.post("/", authMiddleware, (req, res) => controle.salvar(req, res));
patrocinadorRoutes.put("/:id", authMiddleware, (req, res) => controle.atualizar(req, res));
patrocinadorRoutes.delete("/:id", authMiddleware, (req, res) => controle.deletar(req, res));

export default patrocinadorRoutes;
