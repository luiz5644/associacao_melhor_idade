import { AtividadesDao } from "../dao/Atividades.dao";
import { Atividades } from "../modelo/Atividades";

export class AtividadesServico {
    constructor(
        readonly atividadesDao: AtividadesDao
    )
    {}
    public async salvar(atividades:Atividades){
        return await this.atividadesDao.salvar(atividades)
    }
    public async buscarPorId(id:number){
        return await this.atividadesDao.buscarporId(id)
    }
    public async listar(){
        return await this.atividadesDao.listar()
    }
    public async atualizar(atividades:Atividades){
        return await this.atividadesDao.atualizar(atividades)
    }
    public async deletar(id:number){
        return await this.atividadesDao.deletar(id)
    }
    public async listarporCategoria(id:number){
        return await this.atividadesDao.listarporCategoria(id)
    }

}