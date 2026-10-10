import { plainToInstance } from "class-transformer";
import { AlbumDao } from "../dao/Album.dao";
import { AlbumCreateDto,AlbumDto, AlbumUpdateDto } from "../dto/Album.dto";
import { validate } from "class-validator";
import { Album } from "../modelo/Album";
import { AlbumServico } from "../servico/Album.servico";
import { Request,Response } from "express";

export class AlbumControle {
    private albumServico: AlbumServico
    constructor(){
        const albumDao = new AlbumDao()
        this.albumServico = new AlbumServico(albumDao)
    }

    public async salvar(req:Request, res:Response){
        try{
            const albumDto = plainToInstance(AlbumCreateDto,req.body)
            const erros = await validate(albumDto)
            if(erros.length >0 ){
                return res.status(400).json(erros)
            }

            const album = Album.construir(
                albumDto.id?? undefined,
                albumDto.categoria_id,
                albumDto.titulo,
                albumDto.description,
                albumDto.date

            )
             await this.albumServico.salvar(album)
             return res.status(201).json({
                mesage:"Album Salvo com Sucesso"
             })
        }
        catch(error){
            console.log("Erro: ", error)
            return res.status(500).json({
                mesage:"Erro ao salvar Album"
            })
        }

       
    }
    public async buscarporId(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)

            const usuario = await this.albumServico.buscarporId(idNumber)
            return res.status(201).json(usuario)
        }
        catch(error){
            console.log("Erro: ", error)
            return res.status(500).json(
                {
                    mesage:"Erro ao listar Album"
                }
            )
        }
    }
    public async listar(req:Request, res:Response){
        try{
            const albuns = await this.albumServico.listar()
            return res.status(201).json(albuns)
        }
        catch(error){
            console.log("Erro: ", error)
             return res.status(500).json(
                {
                    mesage:"Erro ao listar Albuns"
                }
            )
        }
    }
    public async atualizar(req:Request, res:Response){
        try{
            const albumDto = plainToInstance(AlbumUpdateDto,req.body)
            const id = req.params.id
            const idNumber = Number(id)

            const erros = await validate(albumDto)

            if(erros.length>0){
                return res.status(400).json(erros)
            }
            const album = Album.reconstruir({
                id: idNumber,
                categoria_id: albumDto.categoria_id,
                titulo:albumDto.titulo,
                description:albumDto.description,
                date:albumDto.date
            })

            await this.albumServico.atualizar(album)

        return res.status(200).json({
            message: "Álbum atualizado com sucesso"
        });
        }
        catch(error){
            console.log("Erro: ", error)
            return res.status(500).json({
                mesage: "Erro ao atulizar Album"
            })
        }
    }
    public async deletar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)

            await this.albumServico.deletar(idNumber)
            return res.status(201).json({
                mesage:"Album excluido com Sucesso"
            })
        }
        catch(error){
            console.log("Erro: ", error)
            res.status(500).json({
                mesage:"Erro ao excluir Album"
            })
        }
    }

}