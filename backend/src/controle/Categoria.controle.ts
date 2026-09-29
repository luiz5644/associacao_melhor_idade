import { plainToInstance } from "class-transformer";
import { Request,Response } from "express";
import { categoriaCreateDto, categoriaUpdateDto } from "../dto/Categoria.dto";
import { categoriaDao } from "../dao/Categoria.dao";
import { Categoria } from "../modelo/Categoria";
import { categoriaServico } from "../servico/Categoria.Serviço";
import { validate } from "class-validator";

export class CategoriaControle{
    private categoriaServico : categoriaServico
    constructor(){
        const categoriadao = new categoriaDao()
        this.categoriaServico = new categoriaServico(categoriadao)
    }

    public async salvar(req:Request, res: Response){
        try{
            const categoriaDto = plainToInstance(categoriaCreateDto,req.body)
            const erros = await validate(categoriaDto)
            if(erros.length>0){
                return res.status(400).json(erros)
                
            }
            const categoria = Categoria.construir(
                categoriaDto.id,
                categoriaDto.nome
            )
            await this.categoriaServico.salvar(categoria)
            return res.status(201).json({
                mesage:"Categoria salva com Sucesso"
            })
        }
        catch(error){
            console.log("Erro ao salvar categoria", error)
            res.status(500).json({
                mesage: "Erro ao salvar categoria"
            })
        }
    }
    public async buscarPorId(req: Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const categoria = await this.categoriaServico.buscarPorId(idNumber)
             return res.status(201).json(categoria)

        }
        catch(error){
            console.log("Erro ao buscar categoria",error)
             res.status(500).json({
                mesage: "Erro ao buscar categoria"
            })
            
        }
       
    }
    public async listar(req: Request, res: Response){
        try{
            const categorias = await this.categoriaServico.listar()
            return res.status(201).json(categorias)
        }
        catch(error){
            console.log("Erro ao listar categorias",error)
             res.status(500).json({
                mesage: "Erro listar categorias"
            })

        }
            
        
    }
    public async atualizar(req: Request, res: Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const categoriaDto = plainToInstance(categoriaUpdateDto, req.body)
            const erros = await validate(categoriaDto)
            if(erros.length > 0){
                return res.status(400).json(erros)
            }
            const categoria = Categoria.reconstruir({
                id:idNumber,
                nome: categoriaDto.nome
                
            })
            await this.categoriaServico.atualizar(categoria)
            return res.status(201).json({
                mesage: "Categoria atualizada com sucesso"
            })
        }
        catch(error){
            console.log("Erro ao atualizar Categoria")
            return res.status(500).json({
                
                mesage:"Erro ao atualizar Categoria"
            })
        }
        
    }
    public async deletar (req: Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.categoriaServico.deletar(idNumber)
            return res.status(201).json({
                mesage:"Categoria excluida"
            })
        }
        catch(error){
            console.log("Erro ao excluir categoria", error)
            return res.status(500).json({
                mesage:"Erro ao excluir categoria"
            })
        }
    }
}