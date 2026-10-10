import { AlbumDao } from "../dao/Album.dao";
import { Album } from "../modelo/Album";7

export class AlbumServico{
    constructor(
        readonly albumDao:AlbumDao
    ){

    }
    public async salvar(album:Album){
        return await this.albumDao.salvar(album)
    }
    public async buscarporId(id:number){
        return await this.albumDao.buscarporId(id)
    }
    public async listar(){
        return await this.albumDao.listar()

    }
    public async atualizar(album:Album){
        return await this.albumDao.atualizar(album)
    }
    public async deletar(id:number){
        return await this.albumDao.deletar(id)
    }
}