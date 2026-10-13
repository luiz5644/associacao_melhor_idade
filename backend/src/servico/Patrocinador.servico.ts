import { PatrocinadorDao } from "../dao/Patrocinador.dao";
import { Patrocinador } from "../modelo/Patrocinador";

export class PatrocinadorServico {
    constructor(readonly patrocinadorDao: PatrocinadorDao) {}

    public salvar(patrocinador: Patrocinador) { return this.patrocinadorDao.salvar(patrocinador); }
    public buscarPorId(id: number) { return this.patrocinadorDao.buscarPorId(id); }
    public listar() { return this.patrocinadorDao.listar(); }
    public atualizar(patrocinador: Patrocinador) { return this.patrocinadorDao.atualizar(patrocinador); }
    public deletar(id: number) { return this.patrocinadorDao.deletar(id); }
}
