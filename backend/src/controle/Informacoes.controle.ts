import { Request, Response } from "express";
import { InformacoesDao } from "../dao/Informacoes.dao";
import { InformacoesServico } from "../servico/Informacoes.servico";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { InformacoesUpdateDto } from "../dto/Informacoes.dto";

const servico = new InformacoesServico(new InformacoesDao());

export class InformacoesControle {
  async get(_req: Request, res: Response) {
    try {
      return res.status(200).json((await servico.get()) || {});
    } catch (error) {
      console.error("Erro ao carregar informações:", error);
      return res.status(500).json({ message: "Erro ao carregar informações" });
    }
  }

  async update(req: Request, res: Response) {
    const dto = plainToInstance(InformacoesUpdateDto, req.body || {});
    const errors = await validate(dto);
    if (errors.length) return res.status(400).json({ message: "Dados das informações inválidos", errors });
    try {
      const current = await servico.get();
      const body = dto as Record<string, unknown>;
      const data = { ...current, ...body, name: body.name || current?.name || "Melhor Idade" };
      const info = await servico.update(data);
      return res.status(200).json({ message: "Informações atualizadas com sucesso", data: info });
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      return res.status(500).json({ message: "Erro ao atualizar informações" });
    }
  }
}
