import {Router } from "express";
import adminRoutes from "./adimin.routes";
import eventosRouter from "./Eventos.router";
import AlbumRouter from "./Album.routes";
import fotosRoute from "./Fotos.routes";
import uploadRoute from "./Upload.routes";
import patrocinadorRoutes from "./Patrocinador.routes";
import informacoesRoutes from "./Informacoes.routes";
import AcaoRouter from "./Acao.routes";



const routes = Router()
routes.use("/admin", adminRoutes)
routes.use("/eventos", eventosRouter)
routes.use("/album", AlbumRouter)
routes.use("/fotos",fotosRoute)
routes.use("/upload", uploadRoute)
routes.use("/patrocinadores", patrocinadorRoutes)
routes.use("/informacoes", informacoesRoutes)
routes.use("/acoes",AcaoRouter )




export default routes
