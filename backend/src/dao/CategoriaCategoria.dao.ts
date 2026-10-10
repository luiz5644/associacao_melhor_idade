import { conexao } from "../util/conexao";
import { CategoriaGaleria } from "../modelo/CategoriaGaleria";

export class CategoriaGaleriaDao{
    public async salvar(categoriaGaleria:CategoriaGaleria): Promise <void>{
        try{
             const [rows]:any = await conexao.query(
            'insert into categorias_galeria (nome) values (?)',
            [categoriaGaleria.nome]
        )

        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao Salvar")
        }
       
    }
    public async buscarPorId(id:Number): Promise<CategoriaGaleria|null>{
        try{
            const [rows]: any = await conexao.query(
                'select * from categorias_galeria where id=?',
                [id]
            )
            if(rows.length===0){
                return null
            }
            return CategoriaGaleria.reconstruir(rows[0])

        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao buscar categoria")
        }
    }
    public async listar(): Promise<CategoriaGaleria[]>{
        try{
            const [rows]: any = await conexao.query(
                'select * from categorias_galeria'
            )
            return rows.map((r:any) => CategoriaGaleria.reconstruir({
                id:r.id,
                nome: r.nome
            }))
        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao listar categorias")
        }

    }
    public async atualizar(categoriaGaleria:CategoriaGaleria): Promise<void>{
        try{
            const [result]:any = await conexao.query(
                'update categorias_galeria set nome=? where id=?',
                [categoriaGaleria.nome, categoriaGaleria.id]
            )
            if(result.affectedRows ===0){
                throw new Error("Não foi possível atualizar Categoria")
            }
        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao atualizar Categoria")
        }
    }
    public async deletar(id:number): Promise<void>{
        try{
            const [result]:any = await conexao.query(
                'delete from categorias_galeria where id = ?',
                [id]
            )
            if(result.affectedRows ===0){
                throw new Error("Não foi possível deletar Categoria")
            }

        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao deletar Categoria")
        }
    }
    
}