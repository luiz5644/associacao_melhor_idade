import { conexao } from "../util/conexao";

export class InformacoesDao {
  async get() {
    const [rows]: any = await conexao.query("SELECT * FROM brand_info WHERE id = 1 LIMIT 1");
    return rows[0] || null;
  }

  async update(data: Record<string, unknown>) {
    const fields = ["name", "subtitle", "email", "address", "phone", "pixKey", "mission", "since"];
    const values = fields.map(field => data[field] ?? null);
    await conexao.query(
      `INSERT INTO brand_info (id, name, subtitle, email, address, phone, pixKey, mission, since)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), subtitle=VALUES(subtitle), email=VALUES(email),
       address=VALUES(address), phone=VALUES(phone), pixKey=VALUES(pixKey), mission=VALUES(mission), since=VALUES(since)`,
      values
    );
    return this.get();
  }
}
