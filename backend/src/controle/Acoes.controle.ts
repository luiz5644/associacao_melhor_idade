import { AcoesDao } from "../dao/Acoes.dao";
import { AcoesServicos } from "../servico/Acoes.servico";
import { plainToInstance } from "class-transformer";
import { Request,Response } from "express";
import { validate } from "class-validator";
import { AcoesCreateDto,AcoesUpdateDto } from "../dto/Acoes";
import { Acoes } from "../modelo/Acoes";


export class AcoesControle{
    private acoesServico: AcoesServicos
    constructor(){
        const acoesDao= new AcoesDao()
        this.acoesServico= new AcoesServicos(acoesDao)
    }
    
    public async salvar(req: Request, res: Response){
        try{
            const acoesDto = plainToInstance(AcoesCreateDto, req.body)
            const erros = await validate(acoesDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
           const acao = Acoes.construir(
               acoesDto.id,
               acoesDto.titulo,
               acoesDto.desc,
               acoesDto.data_completa,
               acoesDto.horario,
               acoesDto.local,
               acoesDto.is_highlight,
               acoesDto.status
            );

            await this.acoesServico.salvar(acao)
            return res.status(201).json({ message: "Ação salva com sucesso!" });
        }
        catch (error){
            console.log("Erro ao salvar Ação", error)
            return res.status(500).json({ message: "Erro ao salvar ação" })
        }
    }

    public async buscarporId(req: Request, res: Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const acao = await this.acoesServico.buscarPorId(idNumber)
            if (!acao) {
                return res.status(404).json({ message: "Ação não encontrada" })
            }
            return res.status(200).json(acao)
        }
        catch(error){
            console.log("Erro ao buscar Ação", error)
            return res.status(500).json({ message: "Erro ao buscar ação" })
        }
    }

    public async listar(req: Request, res: Response){
        try{
            const acoes = await this.acoesServico.listar()
            return res.status(200).json(acoes)
        }
        catch(error){
            console.log("Erro ao listar Ações", error)
            res.status(500).json({ message: "Erro ao listar ações" })
        }
    }

    public async atualizar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const acoesDto= plainToInstance(AcoesUpdateDto,req.body)
            const erros = await validate(acoesDto)
            if(erros.length > 0){
                return res.status(400).json(erros)
            }

            const acao = Acoes.reconstruir({
                id: idNumber,
                titulo: acoesDto.titulo!,
                desc: acoesDto.desc!,
                data_completa: acoesDto.data_completa!,
                horario: acoesDto.horario!,
                local: acoesDto.local!,
                is_highlight: acoesDto.is_highlight!,
                status: acoesDto.status!
            });
            await this.acoesServico.atualizar(acao)
            return res.status(200).json({ message: "Ação atualizada com sucesso" })
        }
        catch(error){
            console.log("Erro ao atualizar Ação")
            return res.status(500).json({ message: "Erro ao atualizar ação" })
        }
    }
    
    public async deletar(req:Request, res: Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.acoesServico.deletar(idNumber)
            return res.status(200).json({ message: "Ação excluída com sucesso" })
        }
        catch(error){
            console.log("Erro ao excluir ação", error)
            return res.status(500).json({ message: "Erro ao excluir ação" })
        }
    }
}