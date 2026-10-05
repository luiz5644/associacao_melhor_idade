import {Router } from "express";
import adminRoutes from "./adimin.routes";
import categoriaRouter from "./categoria.routes";
import AtividadeRouter from "./atividades.router";

const routes = Router()
routes.use("/admin", adminRoutes)
routes.use("/categoria", categoriaRouter)
routes.use("/atividades", AtividadeRouter)

export default routes