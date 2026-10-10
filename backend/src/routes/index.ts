import {Router } from "express";
import adminRoutes from "./adimin.routes";
import categoriaRouter from "./categoria.routes";
import AtividadeRouter from "./atividades.router";
import AlbumRouter from "./Album.routes";
import fotosRoute from "./Fotos.routes";
import categoriaRoutes from "./CategoriaGaleria.routes";


const routes = Router()
routes.use("/admin", adminRoutes)
routes.use("/categoria-calendario", categoriaRouter)
routes.use("/atividades", AtividadeRouter)
routes.use("/album", AlbumRouter)
routes.use("/fotos",fotosRoute)
routes.use("/categoria-galeria", categoriaRoutes)


export default routes