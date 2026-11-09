import { Eventos } from "../modelo/Eventos";
import { conexao } from "../util/conexao";
import { logErro } from "../util/logger";

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
            logErro("Erro ao salvar evento", error);
            throw new Error("Erro ao salvar evento");
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
            logErro("Erro ao buscar evento", error);
            throw new Error("Erro ao buscar evento");
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
            logErro("Erro ao listar eventos", error);
            throw new Error("Erro ao listar eventos");
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
                throw new Error("Evento não encontrado");
            }
        } catch (error) {
            logErro("Erro ao atualizar evento", error);
            throw new Error("Erro ao atualizar evento");
        }
    }

    public async deletar(id: number): Promise<void> {
        try {
            const [result]: any = await conexao.query(
                'DELETE FROM eventos WHERE id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                throw new Error("Evento não encontrado");
            }
        } catch (error) {
            logErro("Erro ao deletar evento", error);
            throw new Error("Erro ao deletar evento");
        }
    }
}