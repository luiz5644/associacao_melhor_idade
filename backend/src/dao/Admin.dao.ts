import { conexao } from "../util/conexao";
import { Admin } from "../modelo/Admin";


export class AdminDao{
    public async salvar(admin:Admin): Promise <void>{
        try{
            const cpfLimpo = admin.cpf ? admin.cpf.replace(/\D/g, "") : "";
            const senhaFinal = (admin.senha && admin.senha.trim() !== "" )
            ? admin.senha: cpfLimpo.substring(0, 8);
            const [results]:any = await conexao.query(
                'insert into administradores (username,cpf,senha,email) values (?,?,?,?)',
                [admin.username, admin.cpf,senhaFinal,admin.email]
            )
        }
        catch(error){
            console.error("Erro ao salvar Admin",error)
            throw new Error("Erro ao salvar Admin")
        }
    }
    public async buscarPorId(id:number): Promise<Admin|null>{
        try{
            const[rows]: any = await conexao.query(
                'select * from administradores where id = ?',
                [id]
            )
            if(rows.length ===0){
                return null
            }
            const admin = Admin.reconstruir(rows[0])
            return admin
        }
        catch(error){
            console.error("Erro ao Buscar Admin",error)
            throw new Error("Erro ao Buscar Admin")
        }
    }
    public async listar(): Promise<Admin[]>{
        try{
            const [rows]: any = await conexao.query(
            'select*from administradores'
        )
        return rows.map((r:any)=> Admin.reconstruir(r))

        }
        catch(error){
            console.error(error)
            throw error
        }
        
        
    }
    public async atualizar(admin:Admin): Promise<void>{
        try{const[result]: any = await conexao.query(
            'update administradores set username = ?, senha = ?, email=? where id = ?',
            [admin.username,admin.senha,admin.email,admin.id]
        )
        if(result.affectedRows === 0){
            throw new Error("Admin não encontrado")
        }}
        catch(error){
            console.error(error)
            throw error
        }
        
        
    }
    public async deletar(id:number): Promise<void>{
        try{
            const [result]: any = await conexao.query(
                'delete from administradores where id = ?',
                [id]
            )
            if(result.affectedRows === 0){
                throw new Error("Admin não encontrado")
            }
        }
        catch(error){
            console.error(error)
            throw error
        }
    }
    public async login(identificador: string): Promise <Admin|null>{
        try{
             const cpfLimpo = identificador.replace(/\D/g, "");
             const [rows]: any = await conexao.query(
                'select*from administradores where username = ? or cpf = ?',
                [identificador,cpfLimpo]

                

             )
             if(rows.length===0){
                return null
             }
             const admin = Admin.reconstruir(rows[0])
             return admin

        }
        catch(error){
            console.error(error)
            throw error
        }
       
    }
    public async buscarPorEmail(email:string):Promise <Admin|null>{
        try{
            const [rows]: any = await conexao.query(
            'select * from administradores where email = ?',
            [email]
        )
        if(rows.length===0){
            return null
        }
        const admin = Admin.reconstruir(rows[0])
        return admin

        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao Buscar Admin")
        }
        
    }
    public async salvarTokenRecuperacao(usuarioId:number,tokenHash:string,dataExpiracao:Date): Promise<void>{
        try{
            await conexao.query(
                 `INSERT INTO token_recuperacao
            (usuario_id, token_hash, data_expiracao)
            VALUES (?, ?, ?)`,
            [usuarioId,tokenHash,dataExpiracao]
            )
        }
        catch (error) {
        console.error("Erro ao salvar token de recuperação", error);
        throw new Error("Erro ao salvar token de recuperação");
    }
    }
    public async buscarTokenRecuperacao(
    tokenHash: string
): Promise<any | null> {
    try {
        const [rows]: any = await conexao.query(
            `SELECT *
             FROM token_recuperacao
             WHERE token_hash = ?
               AND utilizado = FALSE
               AND data_expiracao > NOW()
             LIMIT 1`,
            [tokenHash]
        );

        if (rows.length === 0) {
            return null;
        }

        return rows[0];
    } catch (error) {
        console.error("Erro ao buscar token de recuperação", error);
        throw new Error("Erro ao buscar token de recuperação");
    }
}
public async atualizarSenha(id:number,senhaHash: string):Promise<void>{
    try{
        const [result]:any = await conexao.query(
            'update administradores set senha = ? where id =?',
            [senhaHash,id]
        )
        if(result.affectedRows===0){
            throw new Error("Admin não encontrado")
        }
    }
    catch(error){
            console.error("Erro: ", error)
            throw error
        }
        
}
public async marcarTokenComoUtilizado(tokenId: number): Promise<void> {
    try {
        const [result]: any = await conexao.query(
            `UPDATE token_recuperacao
             SET utilizado = TRUE
             WHERE id = ? AND utilizado = FALSE`,
            [tokenId]
        );

        if (result.affectedRows === 0) {
            throw new Error("Token não encontrado ou já utilizado");
        }
    } catch (error) {
        console.error("Erro ao invalidar token", error);
        throw error;
    }
}
    
}