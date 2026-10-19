import { Acoes } from "../modelo/Acoes";
import { AcoesDao } from "../dao/Acoes.dao";

export class AcoesServico{
    constructor(
        private readonly acoesDao: AcoesDao
    ){}

    public async salvar(acoes:Acoes){
        return await this.acoesDao.salvar(acoes)
    }

    public async buscarPorId(id:number){
        return await this.acoesDao.buscarPorId(id)
    }
    public async listar(){
        return await this.acoesDao.listar()
    }
    public async atualizar(acoes:Acoes){
        return await this.acoesDao.atualizar(acoes)
    }
    public async deletar(id:number){
        return await this.acoesDao.deletar(id)
    }
}