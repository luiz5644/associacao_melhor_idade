import { Acoes } from "../modelo/Acoes";
import { conexao } from "../util/conexao";

export class AcoesDao{
    public async salvar(acoes:Acoes):Promise<void>{
        try{
            const [rows]:any = await conexao.query(
                'insert into acoes (dia_semana,horario_inicio,horario_fim,local,responsavel,titulo) values (?,?,?,?,?,?)',
                [acoes.dia_semana,acoes.horario_inicio,acoes.horario_fim,acoes.local,acoes.responsavel,acoes.titulo]
            )
        }
        catch(error){
            console.log("Erro ao salvar Ação: ", error)
            throw new Error("Erro ao salvar Ação")
        }
    }
    public async buscarPorId(id:number): Promise<Acoes|null>{
        try{
            const [rows]:any = await conexao.query(
                'select * from acoes where id = ?',
                [id]
            )
            if(rows.length===0){
                return null
            }
            return Acoes.reconstruir(rows[0])

        }
           catch(error){
            console.log("Erro ao buscar Ação: ", error)
            throw new Error("Erro ao buscar Ação")
        }
    }
    public async listar(): Promise <Acoes[]>{
        try{
            const [rows]: any = await conexao.query(
                'select * from acoes'
            )
            return rows.map((r:any) => Acoes.reconstruir(r))
        }
        catch(error){
            console.log("Erro ao Listar Ações: ", error)
            throw new Error("Erro ao Listar Ações")
        }
    }
    public async atualizar(acoes:Acoes):Promise<void>{
        try{
            const [results]: any = await conexao.query(
                'update acoes set dia_semana = ?, horario_inicio = ?, horario_fim = ?, local =?, responsavel = ?, titulo = ? where id =?',
                [acoes.dia_semana,acoes.horario_inicio,acoes.horario_fim, acoes.local,acoes.responsavel,acoes.titulo, acoes.id]

            )
            if(results.affectedRows===0){
                throw new Error("Ação não encontrado")
            }
        }
        catch(error){
            console.log("Erro ao Atualizar Ação: ", error)
            throw new Error("Erro ao Atualizar Ação")
        }
    }
    public async deletar(id:number): Promise<void>{
        try{
            const [result]: any = await conexao.query(
                'delete from acoes where id =?',
                [id]
            )
            if(result.affectedRows===0){
                throw new Error("Ação não encontrado")
            }
        }
        catch(error){
            console.log("Erro ao Deletar Ação: ", error)
            throw new Error("Erro ao Deletar Ação")
        }
    }
    
}
