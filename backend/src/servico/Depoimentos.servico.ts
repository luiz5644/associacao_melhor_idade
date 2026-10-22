import { Depoimento } from "../modelo/Depoimentos";
import { DepoimentoDao } from "../dao/Depoimentos.dao";

export class DepoimentoServico{
    constructor(private readonly depoimentoDao:DepoimentoDao)
    {}

    public async salvar(depoimento:Depoimento){
        return await this.depoimentoDao.salvar(depoimento)
    }
    public async buscarporId(id:number){
        return await this.depoimentoDao.buscarPorId(id)
    }
    public async listar(){
        return await this.depoimentoDao.listar()
    }
    public async atualizar(depoimento:Depoimento){
        return await this.depoimentoDao.atualizar(depoimento)
    }
    public async deletar(id:number){
        return await this.depoimentoDao.deletar(id)
    }
}