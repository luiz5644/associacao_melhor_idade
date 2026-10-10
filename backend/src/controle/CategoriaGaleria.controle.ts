import { Request,Response} from "express";
import { validate } from "class-validator";
import { CategoriaGaleria } from "../modelo/CategoriaGaleria";
import { CategoriaGaleriaDao } from "../dao/CategoriaCategoria.dao";
import { CategoriaCreateDto, CategoriaUpdateDto } from "../dto/CategoriaGaleria.dto";
import { CategoriaGaleriaServico } from "../servico/CategoriaGaleria.servico";
import { plainToInstance } from "class-transformer";

export class CategoriaGaleriaControle{
    private categoriaGaleriaServico: CategoriaGaleriaServico
    constructor(){
        const categoriaGaleriaDao = new CategoriaGaleriaDao()
        this.categoriaGaleriaServico = new CategoriaGaleriaServico(categoriaGaleriaDao)
    }
    public async salvar(req:Request, res:Response){
        try{
            const categoriaGaleriaDto = plainToInstance(CategoriaCreateDto,req.body)
            const erros = await validate(categoriaGaleriaDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
            const categoria = CategoriaGaleria.construir(
                categoriaGaleriaDto.id,
                categoriaGaleriaDto.nome
            )
            await this.categoriaGaleriaServico.salvar(categoria)
            return res.status(200).json({
                message:"Categoria salva com sucesso"
            })
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                message:"Erro ao salvar Categoria"
            })
        }
        
    }
    public async buscarporId(req:Request,res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const categoria = await this.categoriaGaleriaServico.buscarPorId(idNumber)
            return res.status(200).json(categoria)
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                message:"Erro ao buscar Categoria"
            })
        }
    }
    public async listar(req:Request, res:Response){
        try{
            const categorias = await this.categoriaGaleriaServico.listar()
            return res.status(200).json(categorias)
        }
         catch(error){
            console.log(error)
            return res.status(500).json({
                message:"Erro ao listar Categorias"
            })
        }
    }
    public async atualizar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const categoriaDto = plainToInstance(CategoriaUpdateDto,req.body)
            const erros = await validate(categoriaDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
            const categoria = CategoriaGaleria.reconstruir({
                id: idNumber,
                nome: categoriaDto.nome
            })
            await this.categoriaGaleriaServico.atualizar(categoria)

            return res.status(200).json({
                message:"Categoria atualizada com sucesso"
            })
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                message:"Erro ao atualizar Categoria"
            })
        }
    }
    public async deletar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.categoriaGaleriaServico.deletar(idNumber)
              return res.status(200).json({
            message: "Categoria deletada com sucesso"
        });
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                message:"Erro ao deletar Categoria"
            })
        }
    }



}