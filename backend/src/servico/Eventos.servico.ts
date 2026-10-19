import { Eventos } from "../modelo/Eventos"
import { EventosDao } from "../dao/Eventos.dao"
export class EventosServico{
    constructor(
        readonly eventosDao: EventosDao
    )
    {}
    public async salvar(eventos:Eventos){
       return await this.eventosDao.salvar(eventos)
    }
    public async buscarPorId(id:number){
        return await this.eventosDao.buscarporId(id)
    }
    public async listar(){
        return await this.eventosDao.listar()
    }
    public async atualizar(eventos:Eventos){
        return await this.eventosDao.atualizar(eventos)
    }
    public async deletar(id:number){
        return await this.eventosDao.deletar(id)
    }


}