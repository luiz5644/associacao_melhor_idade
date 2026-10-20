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
        const acoesDto = plainToInstance(AcoesCreateDto,req.body)
        const erros = await validate(acoesDto)
        if(erros.length > 0) return res.status(400).json({ message: "Dados da ação inválidos", errors: erros })
        let acao: Acoes
        try{
            acao = Acoes.construir(
                acoesDto.id,
                acoesDto.dia_semana,
                acoesDto.horario_inicio,
                acoesDto.horario_fim,
                acoesDto.local,
                acoesDto.responsavel,
                acoesDto.titulo
            )
        }
        catch(error){
            return res.status(400).json({ message: error instanceof Error ? error.message : "Dados da ação inválidos" })
        }
        try {
            await this.acoesServico.salvar(acao)
            return res.status(201).json({ message:"Ação salva com sucesso" })
        } catch(error) {
            console.error("Erro ao salvar ação: ", error)
            return res.status(500).json({ message:"Erro ao salvar ação" })
        }
    }
    public async buscarPorId(req:Request, res:Response){
        try{
            const idNumber = Number(req.params.id)
            if (!Number.isInteger(idNumber) || idNumber <= 0) return res.status(400).json({ message:"ID inválido" })

            const acao = await this.acoesServico.buscarPorId(idNumber)
            if (!acao) return res.status(404).json({ message:"Ação não encontrada" })
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
        const idNumber = Number(req.params.id)
        if (!Number.isInteger(idNumber) || idNumber <= 0) return res.status(400).json({ message:"ID inválido" })
        const acaoDto = plainToInstance(AcoesUpdateDto, req.body)
        const erros = await validate(acaoDto)
        if(erros.length > 0) return res.status(400).json({ message:"Dados da ação inválidos", errors: erros })
        try{
            if (!await this.acoesServico.buscarPorId(idNumber)) return res.status(404).json({ message:"Ação não encontrada" })
            const acao = Acoes.construir(
                idNumber,
                acaoDto.dia_semana,
                acaoDto.horario_inicio,
                acaoDto.horario_fim,
                acaoDto.local,
                acaoDto.responsavel,
                acaoDto.titulo
            )

            await this.acoesServico.atualizar(acao)

            return res.status(200).json({ message: "Ação atualizada com sucesso" })
        }
         catch(error){
            if (error instanceof Error && error.message.includes("horário")) return res.status(400).json({ message:error.message })
            console.error("Erro ao atualizar ação: ", error)
            return res.status(500).json({ message:"Erro ao atualizar ação" })
        }
        
    }
    public async deletar(req:Request,res:Response){
        try{
            const idNumber = Number(req.params.id)
            if (!Number.isInteger(idNumber) || idNumber <= 0) return res.status(400).json({ message:"ID inválido" })
            if (!await this.acoesServico.buscarPorId(idNumber)) return res.status(404).json({ message:"Ação não encontrada" })

            await this.acoesServico.deletar(idNumber)
            return res.status(200).json({ message: "Ação excluída com sucesso" })
        }
         catch(error){
            console.error("Erro ao excluir ação: ", error)
            return res.status(500).json({ message:"Erro ao excluir ação" })
        }
    }
}
