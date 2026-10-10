import { conexao } from "../util/conexao";
import { Fotos } from "../modelo/Fotos";

export class FotosDao{
    public async salvar(fotos:Fotos): Promise<void>{
        try{
            const [rows]: any = await conexao.query(
                'insert into fotos_lembranca (album_id,url_imagem,eh_capa) values (?,?,?)',
                [fotos.album_id,fotos.url_imagem,fotos.eh_capa]
            )
        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao salvar Foto")
        }
    }
    public async buscarporId(id:number): Promise<Fotos|null>{
        try{
            const [rows]: any = await conexao.query(
                'select * from fotos_lembranca where id = ?',
                [id]
            )
            if(rows.length ===0){
                return null
            }
            const fotos = Fotos.reconstruir(rows[0])
            return fotos
        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao listar Fotos")
        }
    }
    public async listar():Promise<Fotos[]>{
        try{
            const [rows]: any = await conexao.query(
                'select * from fotos_lembranca'
            )
            return rows.map((r:any) => Fotos.reconstruir({
                id:r.id,
                album_id:r.album_id,
                url_imagem:r.url_imagem,
                eh_capa:r.eh_capa,
                data_upload: r.data_upload
            }))

        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao listar fotos")
        }
    }
    public async atualizar(fotos:Fotos): Promise<void>{
        try{
            const [result]: any = await conexao.query(
                'update fotos_lembranca set album_id = ?, url_imagem = ?, eh_capa = ? where id =? ',
                [fotos.album_id,fotos.url_imagem,fotos.eh_capa,fotos.id]

            )
            if(result.affectedRows===0){
                throw new Error("Não foi possível atualizar a foto")
            }
        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao atualizar Foto")
        }

    }
    public async deletar(id:number): Promise<void>{
        try{
            const [result]: any  = await conexao.query(
                'delete from fotos_lembranca where id =?',
                [id]
            )
            if(result.affectedRows===0){
                throw new Error("Não foi possível excluir a foto")
            }
        }
         catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao excluir Foto")
        }
    }
    
}