import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AdminDao } from "../dao/Admin.dao";
import { Admin } from "../modelo/Admin";
import { randomBytes, createHash } from "node:crypto";
import nodemailer from "nodemailer";

export class adminServico {
      private readonly transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT||587),
            secure: process.env.SMTP_SECURE ==="true",
              auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
        })
    constructor(
        private readonly adminDao: AdminDao,
      
    ) {}

    public async salvar(admin: Admin) {
        return await this.adminDao.salvar(admin);
    }

    public async buscarporId(id: number) {
        return await this.adminDao.buscarPorId(id);
    }

    public async listar() {
        return await this.adminDao.listar();
    }

    public async atualizar(admin: Admin) {
        return await this.adminDao.atualizar(admin);
    }

    public async deletar(id: number) {
        return await this.adminDao.deletar(id);
    }

    public async login(identificador: string, senha: string) {
        const admin = await this.adminDao.login(identificador);

        if (!admin || !admin.senha) {
            throw new Error("Login ou senha inválida");
        }

        const senhaValida = await bcrypt.compare(
            senha,
            admin.senha
        );

        if (!senhaValida) {
            throw new Error("Login ou senha inválida");
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET não está configurado");
        }

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username
            },
            secret,
            {
                expiresIn: "1d"
            }
        );

        return token;
    }
    public async solicitarRecuperacaoSenha(email: string) {
    const resposta =
        "Se o email estiver cadastrado você receberá as instruções";

    const admin = await this.adminDao.buscarPorEmail(email);

    // Não revela se o email existe no banco
    if (!admin) {
        return resposta;
    }

    // Gera um token aleatório e seguro
    const token = randomBytes(32).toString("hex");

    // Armazena somente o hash do token no banco
    const token_hash = createHash("sha256")
        .update(token)
        .digest("hex");

    // Define a validade do token para 15 minutos
    const data_expiracao = new Date(
        Date.now() + 15 * 60 * 1000
    );

    await this.adminDao.salvarTokenRecuperacao(
        admin.id!,
        token_hash,
        data_expiracao
    );

    // Monta o link que será enviado por email
    const frontendUrl = (process.env.FRONTEND_PUBLIC_URL || process.env.FRONTEND_URL || "")
        .split(",")[0]
        ?.trim()
        .replace(/\/+$/, "") ?? "";

    if (!frontendUrl) {
        throw new Error("FRONTEND_PUBLIC_URL/FRONTEND_URL não configurada");
    }

    const link = `${frontendUrl}/redefinir-senha?token=${encodeURIComponent(token)}`;

    // Envia o email de recuperação
    await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Recuperação de senha - Associação Qualidade de Vida",
        text: `Você solicitou a recuperação de sua senha.

Acesse o link abaixo para cadastrar uma nova senha:

${link}

Este link expira em 15 minutos. Se você não solicitou a recuperação, ignore este email.`,
        html: `
            <h2>Recuperação de senha</h2>
            <p>Você solicitou a recuperação de sua senha de administrador.</p>
            <p>Clique no botão abaixo para cadastrar uma nova senha:</p>
            <p>
                <a href="${link}"
                   style="display:inline-block;padding:12px 20px;
                   background-color:#2563eb;color:#ffffff;
                   text-decoration:none;border-radius:6px;">
                    Redefinir minha senha
                </a>
            </p>
            <p>O link expira em 15 minutos.</p>
            <p>Se você não solicitou a recuperação, ignore este email.</p>
        `
    });

    return resposta;
}

    public async redefinirSenha(token:string, novaSenha: string){
        if(!novaSenha || novaSenha.length<6){
            throw new Error("A senha precisa ter no minimo 6 caracteres")
        }
        const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex")

        const registro = await this.adminDao.buscarTokenRecuperacao(tokenHash)
        if(!registro){
            throw new Error("Token invalido ou utilizado")
        }
        const admin = await this.adminDao.buscarPorId(registro.usuario_id)
        if(!admin){
            throw new Error("Admin não encontrado")
        }

        const senhaHash = await bcrypt.hash(novaSenha,10)

        await this.adminDao.atualizarSenha(admin.id!,senhaHash)

        await this.adminDao.marcarTokenComoUtilizado(registro.id);
            return "Senha redefinida com sucesso";



    }
    public async testarEmail() {
    await this.transporter.verify();

    return "Conexão SMTP estabelecida com sucesso";
}
}