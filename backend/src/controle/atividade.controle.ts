import { AtividadesServico } from "../servico/Atividades.servico";
import { Atividades } from "../modelo/Atividades";
import { plainToInstance } from "class-transformer";
import { Request,Response } from "express";
import { validate } from "class-validator";
import { AtividadesDao } from "../dao/Atividades.dao";
import { AtividadeCreateDto, AtividadeUpdateDto} from "../dto/Atividade.dto";


export class AtividadeControle{
    private atividadeServico: AtividadesServico
    constructor(){
        const atividadesDao = new AtividadesDao()
        this.atividadeServico = new AtividadesServico(atividadesDao)
    }
    
    public async salvar(req: Request, res: Response){
        try{
            const atividadeDto = plainToInstance(AtividadeCreateDto, req.body)
            const erros = await validate(atividadeDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
           const atividade = Atividades.construir(
                atividadeDto.id,
                atividadeDto.categoria_id,
                atividadeDto.titulo,
                atividadeDto.desc,
                atividadeDto.data_completa,
                atividadeDto.horario,
                atividadeDto.local,
                atividadeDto.is_highlight,
                atividadeDto.status
            );

            await this.atividadeServico.salvar(atividade)
            return res.status(201).json({ mensage: "Atividade salva com sucesso!" });
        }
        catch (error){
            console.log("Erro ao salvar Atividade", error)
            return res.status(400).json({mensage: "Erro ao salvar Atividade"})
        }
    }
    public async buscarporId(req: Request, res: Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const atividade = await this.atividadeServico.buscarPorId(idNumber)
            return res.status(201).json(atividade)

        }
        catch(error){
            console.log("Erro ao buscar Atividade", error)
            return res.status(500).json({
                mesage: "Erro ao buscar atividade"
            })
        }
    }
    public async listar(req: Request, res: Response){
        try{
            const atividades = await this.atividadeServico.listar()
            return res.status(201).json(atividades)
        }
        catch(error){
            console.log("Erro ao listar Atividades", error)
            res.status(500).json({
                mesage:"Erro ao listar Atividades"
            })
        }
        
    }
    public async atualizar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const atividadeDto = plainToInstance(AtividadeUpdateDto,req.body)
            const erros = await validate(atividadeDto)
            if(erros.length > 0){
                return res.status(400).json(erros)
            }

            const atividade = Atividades.reconstruir({
     id: idNumber,
    categoria_id: atividadeDto.categoria_id!,
    titulo: atividadeDto.titulo!,
    desc: atividadeDto.desc!,
    data_completa: atividadeDto.data_completa!,
    horario: atividadeDto.horario!,
    local: atividadeDto.local!,
    is_highlight: atividadeDto.is_highlight!,
    status: atividadeDto.status!
});
            await this.atividadeServico.atualizar(atividade)
            return res.status(201).json({
                mesage: "Atividade atualizada com sucesso"
            })
        }
        catch(error){
            console.log("Erro ao atualizar Atividade")
              return res.status(500).json({
                mesage: "Erro ao atualizar Atividade"
            })
        }
    }
    public async listarporCategoria(req:Request,res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const atividades = await this.atividadeServico.listarporCategoria(idNumber)
            return res.status(201).json(
                atividades
            )
        }
        catch(error){
            console.log("Erro ao listar atividades", error)
            return res.status(500).json({
                mesage:"Erro ao Listar Atividades"
            })
        }
    }
    public async deletar(req:Request, res: Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.atividadeServico.deletar(idNumber)
            return res.status(201).json(
                {
                    mesage: "Atividade Atualizada com Sucesso"
                }
            )
        }
        catch(error){
            console.log("Erro ao excluir atividade", error)
            return res.status(500).json({
                mesage:"Erro ao excluir atividade"
            })
        }

    }
    

}