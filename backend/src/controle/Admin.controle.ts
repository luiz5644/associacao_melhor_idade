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
        const body = req.body || {};

        const adminDto = plainToInstance(
            adminCreateDto,
            body
        );

        const erros = await validate(adminDto);

        if (erros.length > 0) {
            return res.status(400).json(erros);
        }

        const senhaBruta = adminDto.senha
            ? adminDto.senha
            : adminDto.cpf.replace(/\D/g, "").substring(0, 8);

        const senhaHash = await bcrypt.hash(
            senhaBruta,
            10
        );

        const admin = Admin.construir(
            adminDto.id ?? undefined,
            adminDto.username,
            adminDto.cpf,
            senhaHash,
            adminDto.email,
        );

        await this.adminServico.salvar(admin);

        return res.status(201).json({
            message: "Admin salvo com sucesso"
        });

    } catch (error) {
        console.error("Erro ao cadastrar Admin:", error);

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
                message:"Erro ao buscar admin"
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
                message:"Erro ao listar Admins"
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

            let senhaHash: string | undefined = undefined;
            if (adminDto.senha && adminDto.senha.trim() !== "") {
                senhaHash = await bcrypt.hash(adminDto.senha, 10);
            }

            const admin = Admin.reconstruir({
                id: idNumber,
                username: adminDto.username,
                cpf: "",
                senha: senhaHash,
                email: adminDto.email
            })
            await this.adminServico.atualizar(admin)
            return res.status(200).json({
                message: "Admin atualizado com sucesso"
            })
        }
        catch(error){
            return res.status(500).json({
                message: "Erro ao atualizar Admin"
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
                    message: "Admin excluído com sucesso"
                }
            )
        }
        catch(error){
            return res.status(500).json({
                message: "Erro ao excluir admin"
            })
        }
     }
      public async login(req: Request, res: Response) {
        try {
            const { login, senha } = req.body;

            const token = await this.adminServico.login(login, senha);

            return res.status(200).json({
                token
            });

        } catch (error) {
            if (error instanceof Error && error.message === "Login ou senha inválida") {
                return res.status(401).json({
                    message: "Usuário ou senha inválidos"
                });
            }
            console.error("Erro no login:", error);

            return res.status(500).json({
                message: "Erro interno no servidor ao tentar login"
            });
        }
      }
    public async solicitarRecuperacaoSenha(req:Request, res:Response){
        try{
            const {email} = req.body
            if(!email|| typeof email !== "string"){
                return res.status(400).json({
                    message:"E-mail inválido"
                })
            }
            const resposta = await this.adminServico.solicitarRecuperacaoSenha(email)
            return res.status(200).json({ message: resposta })
        }
        catch(error){
            console.error("Erro ao solicitar recuperação:", error)
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
            return res.status(200).json({ message: mensagem })

        }
        catch(error){
            console.error("Erro ao redefinir senha:", error)
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