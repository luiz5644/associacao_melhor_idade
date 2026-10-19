import { plainToInstance } from "class-transformer";
import { Request,Response } from "express";
import { AcoesCreateDto,AcoesUpdateDto } from "../dto/Acoes.dto";
import { AcoesDao } from "../dao/Acoes.dao";
import { Acoes } from "../modelo/Acoes";
import { AcoesServico } from "../servico/Acoes.servico";
import { validate } from "class-validator";

export class AcoesControle{
    private acoesServico: AcoesServico
    constructor(    
    ){
        const acoesDao = new AcoesDao()
        this.acoesServico = new AcoesServico(acoesDao)
    }

    public async salvar(req:Request,res:Response){
        try{
            const acoesDto = plainToInstance(AcoesCreateDto,req.body)
            const erros = await validate(acoesDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
            const acao = Acoes.construir(
                acoesDto.id,
                acoesDto.dia_semana,
                acoesDto.horario_inicio,
                acoesDto.horario_fim,
                acoesDto.local,
                acoesDto.responsavel,
                acoesDto.titulo
            )
            await this.acoesServico.salvar(acao)
            return res.status(201).json({
                message:"Ação salva com sucesso"
            })
        }
        catch(error){
            console.log("Erro ao salvar ação: ", error)
            return res.status(500).json({
                message:"Erro ao Salvar Ação"
            })
        }
    }
    public async buscarPorId(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)

            const acao = await this.acoesServico.buscarPorId(idNumber)
            return res.status(200).json(acao)
        }
         catch(error){
            console.log("Erro ao buscar ação: ", error)
            return res.status(500).json({
                message:"Erro ao buscar Ação"
            })
        }
    }
    public async listar(req:Request, res: Response){
        try{
            const acoes = await this.acoesServico.listar()
            return res.status(200).json(acoes)
        }
        catch(error){
            console.log("Erro ao listar ações: ", error)
            return res.status(500).json({
                message:"Erro ao listar Ações"
            })
        }
    }
    public async atualizar(req: Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const acaoDto = plainToInstance(AcoesUpdateDto, req.body)
            const erros = await validate(acaoDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }

            const acao = Acoes.reconstruir({
                id:idNumber,
                dia_semana: acaoDto.dia_semana,
                horario_inicio: acaoDto.horario_inicio,
                horario_fim: acaoDto.horario_fim,
                local: acaoDto.local,
                responsavel: acaoDto.responsavel,
                titulo: acaoDto.titulo
            })
            await this.acoesServico.atualizar(acao)

            return res.status(201).json({
                message: "Ação Atualizada com Sucesso"
            })
        }
         catch(error){
            console.log("Erro ao Atualizar ação: ", error)
            return res.status(500).json({
                message:"Erro ao Atualizar Ação"
            })
        }
        
    }
    public async deletar(req:Request,res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)

            await this.acoesServico.deletar(idNumber)
            return res.status(201).json({
                message: "Ação Deletada com Sucesso"
            })
        }
         catch(error){
            console.log("Erro ao Deletar ação: ", error)
            return res.status(500).json({
                message:"Erro ao Deletar Ação"
            })
        }
    }
}