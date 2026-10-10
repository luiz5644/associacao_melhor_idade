import { FotosDao } from "../dao/Fotos.dao";
import { Fotos } from "../modelo/Fotos";

export class FotosServico{
    constructor(
        private readonly fotosDao:FotosDao
    )
    {}
    public async salvar(fotos:Fotos){
        return await this.fotosDao.salvar(fotos)
    }
    public async buscarporId(id:number){
        return await this.fotosDao.buscarporId(id)
    }
    public async listar(){
        return await this.fotosDao.listar()
    }
    public async atualizar(fotos:Fotos){
        return await this.fotosDao.atualizar(fotos)
    }
    public async deletar(id:number){
        return await this.fotosDao.deletar(id)
    }
}