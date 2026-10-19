import { Eventos } from "../modelo/Eventos";
import { conexao } from "../util/conexao";

export class EventosDao {
    public async salvar(eventos:Eventos): Promise<void> {
        try {
            // `desc` envolta em crases
            const [results]: any = await conexao.query(
                'INSERT INTO eventos (titulo, `desc`, data_completa, horario, local, is_highlight, status) VALUES ( ?, ?, ?, ?, ?, ?, ?)',
                [
                    eventos.titulo,
                    eventos.desc,
                    eventos.data_completa,
                    eventos.horario,
                    eventos.local,
                    eventos.is_highlight,
                    eventos.status
                ]
            );
        } catch (error) {
            console.log("Erro ao salvar ação:", error);
            throw new Error("Erro ao salvar ação");
        }
    }

    public async buscarporId(id: number): Promise<Eventos | null> {
        try {
            const [rows]: any = await conexao.query(
                'SELECT * FROM eventos WHERE id = ?',
                [id]
            );
            if (rows.length === 0) {
                return null;
            }
            return Eventos.reconstruir({
                ...rows[0],
                is_highlight: Boolean(rows[0].is_highlight)
            });
        } catch (error) {
            console.log("Erro ao buscar ação:", error);
            throw new Error("Erro ao buscar ação");
        }
    }

    public async listar(): Promise<Eventos[]> {
        try {
            const [rows]: any = await conexao.query(
                'SELECT * FROM eventos'
            );
            return rows.map((r: any) => Eventos.reconstruir({
                ...r,
                is_highlight: Boolean(r.is_highlight)
            }));
        } catch (error) {
            console.log("Erro ao listar ações:", error);
            throw new Error("Erro ao listar ações");
        }
    }

    public async atualizar(eventos: Eventos): Promise<void> {
        try {
            // `desc` envolta em crases
            const [result]: any = await conexao.query(
                'UPDATE eventos SET titulo = ?, `desc` = ?, data_completa = ?, horario = ?, local = ?, is_highlight = ?, status = ? WHERE id = ?',
                [
                    eventos.titulo,
                    eventos.desc,
                    eventos.data_completa,
                    eventos.horario,
                    eventos.local,
                    eventos.is_highlight,
                    eventos.status,
                    eventos.id
                ]
            );
            if (result.affectedRows === 0) {
                throw new Error("Ação não encontrada");
            }
        } catch (error) {
            console.log("Erro ao atualizar ação:", error);
            throw new Error("Erro ao atualizar ação");
        }
    }

    public async deletar(id: number): Promise<void> {
        try {
            const [result]: any = await conexao.query(
                'DELETE FROM eventos WHERE id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Ação não encontrada");
            }
        } catch (error) {
            console.log("Erro ao deletar ação:", error);
            throw new Error("Erro ao deletar ação");
        }
    }
}