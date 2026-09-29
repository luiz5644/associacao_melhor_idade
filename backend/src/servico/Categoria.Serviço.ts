import { Categoria } from "../modelo/Categoria";
import { categoriaDao } from "../dao/Categoria.dao";

export class categoriaServico{
    constructor(
        private readonly categoriaDao:categoriaDao
    )
    {}
    public async salvar(categoria:Categoria){
        return await this.categoriaDao.salvar(categoria)
    }
    public async buscarPorId(id:number){
        return await this.categoriaDao.buscarPorId(id)
    }
    public async listar(){
        return await this.categoriaDao.listar()
    }
    public async atualizar(categoria:Categoria){
        return await this.categoriaDao.atualizar(categoria)
    }
    public async deletar(id:number){
        return await this.categoriaDao.deletar(id)
    }
}