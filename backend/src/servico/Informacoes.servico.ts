import { InformacoesDao } from "../dao/Informacoes.dao";

export class InformacoesServico {
  constructor(private readonly dao = new InformacoesDao()) {}
  get() { return this.dao.get(); }
  update(data: Record<string, unknown>) { return this.dao.update(data); }
}
