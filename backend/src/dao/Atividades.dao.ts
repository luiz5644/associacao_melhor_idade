import { Atividades } from "../modelo/Atividades";
import { conexao } from "../util/conexao";

export class AtividadesDao {
    public async salvar(atividade: Atividades): Promise<void> {
        try {
            // `desc` envolta em crases
            const [results]: any = await conexao.query(
                'INSERT INTO atividades (categoria_id, titulo, `desc`, data_completa, horario, local, is_highlight, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    atividade.categoria_id,
                    atividade.titulo,
                    atividade.desc,
                    atividade.data_completa,
                    atividade.horario,
                    atividade.local,
                    atividade.is_highlight,
                    atividade.status
                ]
            );
        } catch (error) {
            console.log("Erro ao salvar Atividade:", error);
            throw new Error("Erro ao salvar atividade");
        }
    }

    public async buscarporId(id: number): Promise<Atividades | null> {
        try {
            const [rows]: any = await conexao.query(
                `SELECT 
                    a.*,
                    c.nome AS categoria_nome
                FROM atividades a
                LEFT JOIN categorias_calendario c
                    ON a.categoria_id = c.id
                WHERE a.id = ?`,
                [id]
            );
            if (rows.length === 0) {
                return null;
            }
            return Atividades.reconstruir({
                ...rows[0],
                is_highlight: Boolean(rows[0].is_highlight)
            });
        } catch (error) {
            console.log("Erro ao buscar atividade:", error);
            throw new Error("Erro ao buscar Atividade");
        }
    }

    public async listar(): Promise<Atividades[]> {
        try {
            const [rows]: any = await conexao.query(
                `SELECT 
                    a.*,
                    c.nome AS categoria_nome
                FROM atividades a
                LEFT JOIN categorias_calendario c
                    ON a.categoria_id = c.id`
            );
            return rows.map((r: any) => Atividades.reconstruir({
                ...r,
                is_highlight: Boolean(r.is_highlight)
            }));
        } catch (error) {
            console.log("Erro ao listar atividades:", error);
            throw new Error("Erro ao listar atividades");
        }
    }

    public async atualizar(atividade: Atividades): Promise<void> {
        try {
            // `desc` envolta em crases
            const [result]: any = await conexao.query(
                'UPDATE atividades SET categoria_id = ?, titulo = ?, `desc` = ?, data_completa = ?, horario = ?, local = ?, is_highlight = ?, status = ? WHERE id = ?',
                [
                    atividade.categoria_id,
                    atividade.titulo,
                    atividade.desc,
                    atividade.data_completa,
                    atividade.horario,
                    atividade.local,
                    atividade.is_highlight,
                    atividade.status,
                    atividade.id
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
                'DELETE FROM atividades WHERE id = ?',
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
    public async listarporCategoria(categoria_id: number): Promise<Atividades[]> {
    try {

        const [rows]: any = await conexao.query(
            `
            SELECT 
                a.*,
                c.nome AS categoria_nome
            FROM atividades a
            INNER JOIN categorias_calendario c
                ON a.categoria_id = c.id
            WHERE a.categoria_id = ?
            `,
            [categoria_id]
        );

        return rows.map((r: any) => Atividades.reconstruir({
            ...r,
            is_highlight: Boolean(r.is_highlight)
        }));

    } catch (error) {
        console.log("Erro ao listar atividades por categoria:", error);
        throw new Error("Erro ao listar atividades por categoria");
    }
}
}