import { conexao } from "../util/conexao";
import { Album } from "../modelo/Album";
import { logErro } from "../util/logger";

export class AlbumDao {
    public async salvar (album:Album): Promise <number>{
        try{
            const [result]: any = await conexao.query(
            'insert into albuns_lembrancas (titulo,description,date) values (?,?,?) ',
            [album.titulo,album.description,album.date]
        )
            return result.insertId;
        }
        catch(error){
            logErro("Erro ao salvar Album", error)
            throw new Error('Erro ao salvar no Album')
        }

        
    }
    public async buscarporId(id:number): Promise <Album|null>{
        try{
            const [rows]: any = await conexao.query(
                "select id, titulo, description, DATE_FORMAT(date, '%Y-%m-%d') AS date from albuns_lembrancas where id = ?",
                [id]
            )
            if(rows.length===0){
                return null
            }
            const album = Album.reconstruir(rows[0])
            return album
        }
        catch(error){
            logErro("Erro ao buscar Album", error)
            throw new Error("Erro ao buscar Album")
        }

    }
    public async listar(): Promise <Album[]>{
        try{
            const [rows]: any = await conexao.query(
                "select id, titulo, description, DATE_FORMAT(date, '%Y-%m-%d') AS date from albuns_lembrancas"
            )
            return rows.map((r:any) => Album.reconstruir(r))
        }
        catch(error){
            logErro("Erro ao listar Album", error)
            throw new Error("Erro ao listar Album")
        }
    }
    public async atualizar(album:Album): Promise<void>{
        try{
             const [result]: any = await conexao.query(
            'update albuns_lembrancas set titulo= ?, description= ?,date =? where id =? ',
            [album.titulo,album.description,album.date, album.id]
            )

            if(result.affectedRows===0){
                throw new Error("Album não encontrado")
            }
            
        }
        catch(error){
            logErro("Erro ao atualizar Album", error)
            throw new Error("Erro ao atualizar Album");
        }
       
    }
    public async deletar (id:number): Promise<void>{
        try{
            const [results]:any = await conexao.query(
                'delete from albuns_lembrancas where id =?',
                [id]
            )
            if(results.affectedRows===0){
                throw new Error("Album não encontrado")
            }
    }
    catch(error){
        logErro("Erro ao excluir Album", error)
        throw new Error("Erro ao excluir album")
    }
}}
