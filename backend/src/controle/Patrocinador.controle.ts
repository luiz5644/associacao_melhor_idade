import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { PatrocinadorCreateDto, PatrocinadorUpdateDto } from "../dto/Patrocinador.dto";
import { Patrocinador } from "../modelo/Patrocinador";
import { PatrocinadorDao } from "../dao/Patrocinador.dao";
import { PatrocinadorServico } from "../servico/Patrocinador.servico";

export class PatrocinadorControle {
    private patrocinadorServico = new PatrocinadorServico(new PatrocinadorDao());

    public async salvar(req: Request, res: Response) {
        const dto = plainToInstance(PatrocinadorCreateDto, req.body);
        const errors = await validate(dto);
        if (errors.length) return res.status(400).json({ message: "Dados do patrocinador inválidos", errors });
        try {
            const patrocinador = Patrocinador.construir({
                id: undefined,
                nome: dto.nome.trim(),
                logo: dto.logo || null,
                category: null,
                websiteUrl: dto.websiteUrl || null,
                description: dto.description?.trim() || null,
                active: dto.active ?? true,
            });
            const id = await this.patrocinadorServico.salvar(patrocinador);
            return res.status(201).json({ message: "Patrocinador cadastrado com sucesso", id });
        } catch (error) {
            console.error("Erro ao cadastrar patrocinador:", error);
            return res.status(500).json({ message: "Erro ao cadastrar patrocinador" });
        }
    }

    public async buscarPorId(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "ID inválido" });
        try {
            const patrocinador = await this.patrocinadorServico.buscarPorId(id);
            if (!patrocinador) return res.status(404).json({ message: "Patrocinador não encontrado" });
            return res.status(200).json(patrocinador);
        } catch (error) {
            console.error("Erro ao buscar patrocinador:", error);
            return res.status(500).json({ message: "Erro ao buscar patrocinador" });
        }
    }

    public async listar(_req: Request, res: Response) {
        try {
            return res.status(200).json(await this.patrocinadorServico.listar());
        } catch (error) {
            console.error("Erro ao listar patrocinadores:", error);
            return res.status(500).json({ message: "Erro ao listar patrocinadores" });
        }
    }

    public async atualizar(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "ID inválido" });
        const dto = plainToInstance(PatrocinadorUpdateDto, req.body);
        const errors = await validate(dto);
        if (errors.length) return res.status(400).json({ message: "Dados do patrocinador inválidos", errors });
        try {
            const atual = await this.patrocinadorServico.buscarPorId(id);
            if (!atual) return res.status(404).json({ message: "Patrocinador não encontrado" });
            const patrocinador = Patrocinador.construir({
                id,
                nome: dto.nome?.trim() ?? atual.nome,
                logo: dto.logo !== undefined ? dto.logo : atual.logo,
                category: atual.category,
                websiteUrl: dto.websiteUrl !== undefined ? dto.websiteUrl : atual.websiteUrl,
                description: dto.description !== undefined ? dto.description?.trim() || null : atual.description,
                active: dto.active ?? atual.active,
            });
            await this.patrocinadorServico.atualizar(patrocinador);
            return res.status(200).json({ message: "Patrocinador atualizado com sucesso" });
        } catch (error) {
            console.error("Erro ao atualizar patrocinador:", error);
            return res.status(500).json({ message: "Erro ao atualizar patrocinador" });
        }
    }

    public async deletar(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "ID inválido" });
        try {
            const patrocinador = await this.patrocinadorServico.buscarPorId(id);
            if (!patrocinador) return res.status(404).json({ message: "Patrocinador não encontrado" });
            await this.patrocinadorServico.deletar(id);
            return res.status(200).json({ message: "Patrocinador removido com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir patrocinador:", error);
            return res.status(500).json({ message: "Erro ao excluir patrocinador" });
        }
    }
}
