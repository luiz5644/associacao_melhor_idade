import { Acoes } from "../modelo/Acoes";
import { conexao } from "../util/conexao";

export class AcoesDao {
    public async salvar(acoes:Acoes): Promise<void> {
        try {
            // `desc` envolta em crases
            const [results]: any = await conexao.query(
                'INSERT INTO acoes (titulo, `desc`, data_completa, horario, local, is_highlight, status) VALUES ( ?, ?, ?, ?, ?, ?, ?)',
                [
                    acoes.titulo,
                    acoes.desc,
                    acoes.data_completa,
                    acoes.horario,
                    acoes.local,
                    acoes.is_highlight,
                    acoes.status
                ]
            );
        } catch (error) {
            console.log("Erro ao salvar Atividade:", error);
            throw new Error("Erro ao salvar atividade");
        }
    }

    public async buscarporId(id: number): Promise<Acoes | null> {
        try {
            const [rows]: any = await conexao.query(
                'SELECT * FROM acoes WHERE id = ?',
                [id]
            );
            if (rows.length === 0) {
                return null;
            }
            return Acoes.reconstruir({
                ...rows[0],
                is_highlight: Boolean(rows[0].is_highlight)
            });
        } catch (error) {
            console.log("Erro ao buscar atividade:", error);
            throw new Error("Erro ao buscar Atividade");
        }
    }

    public async listar(): Promise<Acoes[]> {
        try {
            const [rows]: any = await conexao.query(
                'SELECT * FROM acoes'
            );
            return rows.map((r: any) => Acoes.reconstruir({
                ...r,
                is_highlight: Boolean(r.is_highlight)
            }));
        } catch (error) {
            console.log("Erro ao listar atividades:", error);
            throw new Error("Erro ao listar atividades");
        }
    }

    public async atualizar(acoes: Acoes): Promise<void> {
        try {
            // `desc` envolta em crases
            const [result]: any = await conexao.query(
                'UPDATE acoes SET titulo = ?, `desc` = ?, data_completa = ?, horario = ?, local = ?, is_highlight = ?, status = ? WHERE id = ?',
                [
                    acoes.titulo,
                    acoes.desc,
                    acoes.data_completa,
                    acoes.horario,
                    acoes.local,
                    acoes.is_highlight,
                    acoes.status,
                    acoes.id
                ]
            );
            if (result.affectedRows === 0) {
                throw new Error("Atividade não encontrada");
            }
        } catch (error) {
            console.log("Erro ao atualizar atividade:", error);
            throw new Error("Erro ao atualizar atividade");
        }
    }

    public async deletar(id: number): Promise<void> {
        try {
            const [result]: any = await conexao.query(
                'DELETE FROM acoes WHERE id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Atividade não encontrada");
            }
        } catch (error) {
            console.log("Erro ao deletar Atividade:", error);
            throw new Error("Erro ao deletar Atividade");
        }
    }

    // Corrigido para retornar instâncias de Atividades[]

}