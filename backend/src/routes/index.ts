import {Router } from "express";
import adminRoutes from "./adimin.routes";
import acoesRouter from "./Acoes.router";
import AlbumRouter from "./Album.routes";
import fotosRoute from "./Fotos.routes";
import uploadRoute from "./Upload.routes";



const routes = Router()
routes.use("/admin", adminRoutes)
routes.use("/acoes", acoesRouter)
routes.use("/album", AlbumRouter)
routes.use("/fotos",fotosRoute)
routes.use("/upload", uploadRoute)



export default routes
