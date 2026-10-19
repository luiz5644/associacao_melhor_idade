import { plainToInstance } from "class-transformer";
import { AdminDao } from "../dao/Admin.dao";
import { adminCreateDto,adminUpdateDto } from "../dto/Admin.dto";
import { Request,Response } from "express";
import { validate } from "class-validator";
import { adminServico } from "../servico/Admin.servico";
import bcrypt from "bcrypt";
import { Admin } from "../modelo/Admin";

export class AdminControle{
     private adminServico: adminServico

     constructor(){
        const adminDao = new AdminDao()
        this.adminServico = new adminServico(adminDao)
        
     }
  public async salvar(req: Request, res: Response) {
    try {
        console.log("========== CADASTRO ADMIN ==========");

        console.log("BODY RECEBIDO:", req.body);

        const body = req.body || {};

        const adminDto = plainToInstance(
            adminCreateDto,
            body
        );

        console.log("DTO TRANSFORMADO:", adminDto);

        const erros = await validate(adminDto);

        console.log("ERROS DE VALIDAÇÃO:", erros);

        if (erros.length > 0) {
            return res.status(400).json(erros);
        }

        const senhaBruta = adminDto.senha
            ? adminDto.senha
            : adminDto.cpf.replace(/\D/g, "").substring(0, 8);

        console.log("USERNAME:", adminDto.username);
        console.log("CPF:", adminDto.cpf);
        console.log("SENHA EXISTE:", !!senhaBruta);

        const senhaHash = await bcrypt.hash(
            senhaBruta,
            10
        );

        console.log("HASH GERADO COM SUCESSO");

        const admin = Admin.construir(
            adminDto.id ?? undefined,
            adminDto.username,
            adminDto.cpf,
            senhaHash,
            adminDto.email,
            
        );

        console.log("ADMIN CONSTRUÍDO:", admin);

        await this.adminServico.salvar(admin);

        console.log("ADMIN SALVO NO BANCO");

        return res.status(201).json({
            message: "Admin salvo com sucesso"
        });

    } catch (error) {
        console.error("========== ERRO AO CADASTRAR ==========");
        console.error(error);

        return res.status(500).json({
            message: "Erro ao cadastrar Admin"
        });
    }
}
     public async buscarporId(req:Request,res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const admin = await this.adminServico.buscarporId(idNumber)
            return res.status(200).json(admin)
        }
        catch(error){
            return res.status(500).json({
                mesage:"Erro ao buscar admin"
            })
        }

     }
     public async listar(req:Request, res:Response){
        try{
            const usuarios = await this.adminServico.listar()
            return res.status(200).json(usuarios)
        }
        catch{
            return res.status(500).json({
                mesage:"Erro ao listar Admins"
            })
        }

     }
     public async atualizar(req:Request, res: Response){
        try{
            const adminDto = plainToInstance(adminUpdateDto,req.body)
        const id = req.params.id
        const idNumber = Number(id)
        const erros = await validate(adminDto)

        if(erros.length>0){
            return res.status(400).json(erros)
        }

        const admin = Admin.reconstruir({
            id:idNumber,
            username: adminDto.username,
            cpf: "",
            senha: adminDto.senha,
            email: adminDto.email
        }
        
        

        )
        await this.adminServico.atualizar(admin)
        return res.json({
            mesage:"Admin Atualizado com sucesso"
        })

        }
        catch(error){
            return res.status(500).json({
                mesage: "Erro ao atualizar Admin"
            })
        }
        
        
        
     }
     public async deletar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.adminServico.deletar(idNumber)
            return res.status(200).json(
                {
                    mesage: "Admin Excluido com Sucesso"
                }
            )
        }
        catch(error){
            return res.status(500).json({
                mesage: "Erro ao excluir admin"
            })
        }
     }
      public async login(req: Request, res: Response) {
    try {
        console.log("========== LOGIN ==========");
        console.log("BODY RECEBIDO:", req.body);

        const { login, senha } = req.body;

        console.log("LOGIN:", login);
        console.log("SENHA:", senha);

        const token = await this.adminServico.login(login, senha);

        console.log("LOGIN REALIZADO COM SUCESSO");

        return res.status(200).json({
            token
        });

    } catch (error) {
        console.error("========== ERRO NO LOGIN ==========");
        console.error(error);

        return res.status(500).json({
            message: "Usuário ou senha inválidos"
        });
        }
        
      }
    public async solicitarRecuperacaoSenha(req:Request, res:Response){
        try{
            const {email} = req.body
            if(!email|| typeof email !== "string"){
                return res.status(400).json({
                    message:"E-mail invalido"
                })
            }
            const resposta = await this.adminServico.solicitarRecuperacaoSenha(email)
            return res.status(200).json(resposta)
        }
        catch(error){
            console.log("Erro: ", error)
             return res.status(500).json({
            message: "Erro ao solicitar recuperação de senha"
        });
        }
    }

    public async redefinirSenha(req:Request, res:Response){
        try{
            const {token,novaSenha} = req.body
             if (
            typeof token !== "string" ||
            typeof novaSenha !== "string"
        ) {
            return res.status(400).json({
                message: "Informe o token e a nova senha"
            });
        }
        const mensagem = await this.adminServico.redefinirSenha(token,novaSenha)
        return res.status(200).json(mensagem)

        }
        catch(error){
            console.log("Erro: ", error)
             return res.status(500).json({
            message: "Erro ao solicitar redefinir senha"
        });
        }

        



        
    }
    public async testarEmail(req: Request, res: Response) {
    try {
        const resultado = await this.adminServico.testarEmail();

        return res.status(200).json({
            message: resultado
        });
    } catch (error) {
        console.error("Erro ao testar SMTP:", error);

        return res.status(500).json({
            message: "Falha na conexão SMTP"
        });
    }
}
    

    
}