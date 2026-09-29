import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AdminDao } from "../dao/Admin.dao";
import { Admin } from "../modelo/Admin";

export class adminServico {
    constructor(
        private readonly adminDao: AdminDao
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

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username
            },
            "SEGREDO_DO_TOKEN",
            {
                expiresIn: "1d"
            }
        );

        return token;
    }
}