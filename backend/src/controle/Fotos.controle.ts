import { plainToInstance } from "class-transformer";
import { Request,Response } from "express";
import { FotoCreateDto,FotoUpadateDto } from "../dto/Fotos.dto";
import { validate } from "class-validator";
import { Fotos } from "../modelo/Fotos";
import { FotosServico } from "../servico/Fotos.servico";
import { FotosDao } from "../dao/Fotos.dao";

export class FotosControle{
    private fotosServico: FotosServico
    constructor(){
        const fotosDao = new FotosDao()
        this.fotosServico = new FotosServico(fotosDao)
    }
    public async salvar(req:Request,res:Response){
        try{
            const fotosDto = plainToInstance(FotoCreateDto, req.body)
            const erros = await validate(fotosDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
            const foto = Fotos.construir(
                fotosDto.id?? undefined,
                fotosDto.album_id,
                fotosDto.url_imagem,
                fotosDto.eh_capa,
                fotosDto.data_upload?? undefined
            )

            this.fotosServico.salvar(foto)
            return res.status(200).json({
                message: "Foto salva com sucesso"
            })
        }
        catch(error){
            console.log("Erro:", error)
            return res.status(500).json({
                message:"Erro ao salvar Fotos"
            })
        }
    }
    public async buscarPorId(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const foto = await this.fotosServico.buscarporId(idNumber)
            return res.status(200).json(foto)
        }
        catch(error){
            console.log("Erro:", error)
            return res.status(500).json({
                message:"Erro ao buscar Foto"
            })
        }
    }
    public async listar(req:Request, res:Response){
        try{
            const fotos = await this.fotosServico.listar()
            return res.status(200).json(fotos)
        }
        catch(error){
            console.log("Erro:", error)
            return res.status(500).json({
                message:"Erro ao listar Fotos"
            })
        }
    }
    public async atualizar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const fotosDto = plainToInstance(FotoUpadateDto,req.body)
            const erros = await validate(fotosDto)

            if(erros.length>0){
                return res.status(400).json(erros)
            }

            const foto = Fotos.reconstruir({
                id: idNumber,
                album_id: fotosDto.album_id,
                url_imagem: fotosDto.url_imagem,
                eh_capa: fotosDto.eh_capa,
                data_upload: ""
            })

            await this.fotosServico.atualizar(foto)
            return res.status(200).json({
                message: "Foto atualizada com sucesso"
            })
        }
        catch(error){
            console.log("Erro:", error)
            return res.status(500).json({
                message:"Erro ao atualizar Foto"
            })
        }
    }
    public async deletar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.fotosServico.deletar(idNumber)
            return res.status(200).json({
                message: "Foto deletada com sucesso"
            })
        }
        catch(error){
            console.log("Erro:", error)
            return res.status(500).json({
                message:"Erro ao deletar Foto"
            })
        }
    }
    

}