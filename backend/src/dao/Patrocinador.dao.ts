import { conexao } from "../util/conexao";
import { Patrocinador } from "../modelo/Patrocinador";

export class PatrocinadorDao {
    public async salvar(patrocinador: Patrocinador): Promise<number> {
        const [result]: any = await conexao.query(
            "INSERT INTO patrocinadores (nome, logo, category, websiteUrl, description, active) VALUES (?, ?, ?, ?, ?, ?)",
            [patrocinador.nome, patrocinador.logo, patrocinador.category, patrocinador.websiteUrl, patrocinador.description, patrocinador.active]
        );
        return result.insertId;
    }

    public async buscarPorId(id: number): Promise<Patrocinador | null> {
        const [rows]: any = await conexao.query("SELECT * FROM patrocinadores WHERE id = ?", [id]);
        return rows.length ? this.fromRow(rows[0]) : null;
    }

    public async listar(): Promise<Patrocinador[]> {
        const [rows]: any = await conexao.query("SELECT * FROM patrocinadores ORDER BY id DESC");
        return rows.map((row: any) => this.fromRow(row));
    }

    public async atualizar(patrocinador: Patrocinador): Promise<void> {
        const [result]: any = await conexao.query(
            "UPDATE patrocinadores SET nome = ?, logo = ?, category = ?, websiteUrl = ?, description = ?, active = ? WHERE id = ?",
            [patrocinador.nome, patrocinador.logo, patrocinador.category, patrocinador.websiteUrl, patrocinador.description, patrocinador.active, patrocinador.id]
        );
        if (result.affectedRows === 0) throw new Error("Patrocinador não encontrado");
    }

    public async deletar(id: number): Promise<void> {
        const [result]: any = await conexao.query("DELETE FROM patrocinadores WHERE id = ?", [id]);
        if (result.affectedRows === 0) throw new Error("Patrocinador não encontrado");
    }

    private fromRow(row: any): Patrocinador {
        return Patrocinador.reconstruir({ ...row, active: Boolean(row.active) });
    }
}
