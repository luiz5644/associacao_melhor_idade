import { EventosDao } from "../dao/Eventos.dao";
import { EventosServico } from "../servico/Eventos.servico";
import { plainToInstance } from "class-transformer";
import { Request,Response } from "express";
import { validate } from "class-validator";
import { EventosCreateDto,EventosUpdateDto } from "../dto/Eventos.dto";
import { Eventos } from "../modelo/Eventos";


export class EventosControle{
    private eventosServico: EventosServico
    constructor(){
        const eventosDao= new EventosDao()
        this.eventosServico= new EventosServico(eventosDao)
    }
    
    public async salvar(req: Request, res: Response){
        try{
            const eventosDto = plainToInstance(EventosCreateDto, req.body)
            const erros = await validate(eventosDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
           const evento = Eventos.construir(
               eventosDto.id,
               eventosDto.titulo,
               eventosDto.desc,
               eventosDto.data_completa,
               eventosDto.horario,
               eventosDto.local,
               eventosDto.is_highlight,
               eventosDto.status
            );

            await this.eventosServico.salvar(evento)
            return res.status(201).json({ message: "Evento salvo com sucesso!" });
        }
        catch (error){
            console.log("Erro ao salvar Evento", error)
            return res.status(500).json({ message: "Erro ao salvar Evento" })
        }
    }

    public async buscarporId(req: Request, res: Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const evento = await this.eventosServico.buscarPorId(idNumber)
            if (!evento) {
                return res.status(404).json({ message: "Evento não encontrado" })
            }
            return res.status(200).json(evento)
        }
        catch(error){
            console.log("Erro ao buscar Evento", error)
            return res.status(500).json({ message: "Erro ao buscar Evento" })
        }
    }

    public async listar(req: Request, res: Response){
        try{
            const eventos = await this.eventosServico.listar()
            return res.status(200).json(eventos)
        }
        catch(error){
            console.log("Erro ao listar Eventos", error)
            res.status(500).json({ message: "Erro ao listar Eventos" })
        }
    }

    public async atualizar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const eventosDto= plainToInstance(EventosUpdateDto,req.body)
            const erros = await validate(eventosDto)
            if(erros.length > 0){
                return res.status(400).json(erros)
            }

            const acao = Eventos.reconstruir({
                id: idNumber,
                titulo: eventosDto.titulo!,
                desc: eventosDto.desc!,
                data_completa: eventosDto.data_completa!,
                horario: eventosDto.horario!,
                local: eventosDto.local!,
                is_highlight: eventosDto.is_highlight!,
                status: eventosDto.status!
            });
            await this.eventosServico.atualizar(acao)
            return res.status(200).json({ message: "Evento atualizado com sucesso" })
        }
        catch(error){
            console.log("Erro ao atualizar Evento")
            return res.status(500).json({ message: "Erro ao atualizar Evento" })
        }
    }
    
    public async deletar(req:Request, res: Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.eventosServico.deletar(idNumber)
            return res.status(200).json({ message: "Evento excluído com sucesso" })
        }
        catch(error){
            console.log("Erro ao excluir Evento", error)
            return res.status(500).json({ message: "Erro ao excluir Evento" })
        }
    }
}