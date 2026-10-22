import { conexao } from "../util/conexao";
import { Depoimento } from "../modelo/Depoimentos";

export class DepoimentoDao{
    public async salvar(depoimento:Depoimento):Promise <void>{
        try{
             const [rows]:any = await conexao.query(
            'insert into depoimentos (nome,papel,url_imagem,depoimento) values(?,?,?,?)',
            [depoimento.nome,depoimento.papel,depoimento.url_imagem,depoimento.depoimento]
        )

        }
        catch(error){
            console.log("Error: ",error)
            throw new Error("Erro ao Salvar depoimento")
        }
       
    }
    public async buscarPorId(id:number):Promise<Depoimento|null>{
        try{
            const [rows]:any = await conexao.query(
                'select * from depoimentos where id = ?',
                [id]
            )
            if(rows.length===0){
                return null
            }
            return Depoimento.reconstruir(rows[0])
        }
         catch(error){
            console.log("Error: ",error)
            throw new Error("Erro ao Buscar depoimento")
        }
    }
    public async listar():Promise<Depoimento[]>{
        try{
            const [rows]: any = await conexao.query(
                'select * from depoimentos order by id desc'
            )
            return rows.map((r:any) => Depoimento.reconstruir(r))
        }
        catch(error){
            console.log("Error: ",error)
            throw new Error("Erro ao Listar depoimento")
        }
        
    }
    public async atualizar(depoimento:Depoimento):Promise<void>{
        try{
            const [results]: any = await conexao.query(
                'update depoimentos set nome = ?, papel =?, url_imagem = ?, depoimento = ? where id = ?',
                [depoimento.nome,depoimento.papel, depoimento.url_imagem, depoimento.depoimento,depoimento.id]
            )

            if(results.affectedRows===0){
                throw new Error("Depoimento não encontrado")
            }
        }
        catch(error){
            console.log("Error: ",error)
            throw new Error("Erro ao Atualizar depoimento")
        }
    }
    public async deletar(id:number):Promise<void>{
        try{
            const [result]: any = await conexao.query(
                'delete from depoimentos where id =?',
                [id]
            )
            if(result.affectedRows===0){
                throw new Error("Depoimento não encontrado")
            }
        }
        catch(error){
            console.log("Error: ",error)
            throw new Error("Erro ao Excluir depoimento")
        }
    }
}
