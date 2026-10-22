import { Depoimento } from "../modelo/Depoimentos";
import { DepoimentoDao } from "../dao/Depoimentos.dao";
import { DepoimentoServico } from "../servico/Depoimentos.servico";
import { DepoimentoCreateDto,DepoimentoUpdateDto } from "../dto/Depoimento.dto";
import { Request,Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class DepoimentoControle{
    private depoimentoServico: DepoimentoServico
    constructor(){
        const depoimentoDao = new DepoimentoDao()
        this.depoimentoServico = new DepoimentoServico(depoimentoDao)
    }

    public async salvar(req:Request, res:Response){
        try{
            const depoimentosDto = plainToInstance(DepoimentoCreateDto,req.body)
            const erros = await validate(depoimentosDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }

            const depoimento = Depoimento.construir(
                depoimentosDto.id,
                depoimentosDto.nome,
                depoimentosDto.papel,
                depoimentosDto.url_imagem,
                depoimentosDto.depoimento
            )
            await this.depoimentoServico.salvar(depoimento)
            return res.status(201).json({
                message: "Depoimento salvo com Sucesso"
            })
        }
        catch(error){
            console.log("Erro:",error)
            return res.status(500).json({
                message: "Erro ao salvar depoimento"
            })
        }
    }
    public async buscarPorId(req:Request,res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const depoimento = await this.depoimentoServico.buscarporId(idNumber)
            return res.status(200).json(depoimento)
        }
        catch(error){
            console.log("Erro:",error)
            return res.status(500).json({
                message: "Erro ao buscar depoimento"
            })
        }
    }
    public async listar(req:Request, res:Response){
        try{
            const depoimentos = await this.depoimentoServico.listar()
            return res.status(200).json(depoimentos)
        }
        catch(error){
            console.log("Erro:",error)
            return res.status(500).json({
                message: "Erro ao listar depoimentos"
            })
        }
    }
    public async atualizar(req:Request,res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)

            const depoimentoDto = plainToInstance(DepoimentoUpdateDto,req.body)
            const erros = await validate(depoimentoDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }

            const depoimento = Depoimento.reconstruir({
                id:idNumber,
                nome:depoimentoDto.nome,
                papel:depoimentoDto.papel,
                url_imagem:depoimentoDto.url_imagem,
                depoimento:depoimentoDto.depoimento
            })

            await this.depoimentoServico.atualizar(depoimento)

            return res.status(201).json({
                message: "Depoimento atualizado com sucesso"
            })
        }
        catch(error){
            console.log("Erro:",error)
            return res.status(500).json({
                message: "Erro ao atualizar depoimento"
            })
        }
    }
    public async deletar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.depoimentoServico.deletar(idNumber)
            return res.status(200).json({
                message: "Depoimento excluido com sucesso"
            })
        }
        catch(error){
            console.log("Erro:",error)
            return res.status(500).json({
                message: "Erro ao excluir depoimento"
            })
        }
    }
}