import { conexao } from "../util/conexao";
import { Categoria } from "../modelo/Categoria";

export class categoriaDao{
    public async salvar(categoria:Categoria): Promise<void>{
        try{
            const [results]: any = await conexao.query(
                'insert into categorias_calendario (id,nome) values (?,?)',
                [categoria.id ?? null, categoria.nome]
            );
        }
        catch(error){
            console.log("Erro ao salvar categoria",error);
            throw new Error("Erro ao salvar Categoria");
        }
    }

    public async buscarPorId(id:number): Promise<Categoria|null>{
        try{
            const [rows]: any = await conexao.query(
                'select * from categorias_calendario where id = ?',
                [id]
            );
            if (!rows || rows.length === 0){
                return null;
            }
            const categoria = Categoria.reconstruir(rows[0]);
            return categoria;
        }
        catch(error){
            console.log("Erro ao buscar Categoria" ,error);
            throw new Error ("Erro ao buscar Categoria");
        }
    }

    public async listar(): Promise<Categoria[]>{
        try{
            const [rows]: any = await conexao.query(
                'select * from categorias_calendario'
            );
            const categorias = rows.map((r:any) => Categoria.reconstruir(r));
            return categorias;
        }
        catch(error){
            console.log("Erro ao listar Categorias", error);
            throw new Error("Erro ao Listar Categorias");
        }
    }

    public async atualizar(categoria: Categoria): Promise <void>{
        try{
            const [result]: any = await conexao.query(
                'update categorias_calendario set nome = ? where id = ?',
                [categoria.nome, categoria.id]
            );
            if(result.affectedRows === 0){
                throw new Error("Categoria não encontrada");
            }
        }
        catch(error){
            console.log("Erro ao atualizar Categoria", error);
            throw new Error("Erro ao Atualizar");
        }
    }
    public async deletar(id:number): Promise <void>{
        try{
            const [result]: any = await conexao.query( 
                'delete from categorias_calendario where id = ?',
                [id]

            )
            if(result.affectedRows===0){
                throw new Error("Categoria não encontrada")
            }

        }
        catch(error){
            console.log("Erro ao excluir Categoria", error)
            throw new Error("Erro ao excluir Categoria")
        }
    }

}