import { CategoriaGaleria } from "../modelo/CategoriaGaleria";
import { CategoriaGaleriaDao } from "../dao/CategoriaCategoria.dao";

export class CategoriaGaleriaServico{
    constructor(readonly categoriaGaleriaDao: CategoriaGaleriaDao )
    {}

    public async salvar(categoriaGaleria:CategoriaGaleria){
        return await this.categoriaGaleriaDao.salvar(categoriaGaleria)
    }
    public async buscarPorId(id:number){
        return await this.categoriaGaleriaDao.buscarPorId(id)
    }
    public async listar(){
        return await this.categoriaGaleriaDao.listar()
    }
    public async atualizar(categoriaGaleria: CategoriaGaleria){
        return await this.categoriaGaleriaDao.atualizar(categoriaGaleria)
    }
    public async deletar(id:number){
        return await this.categoriaGaleriaDao.deletar(id)
    }
}
