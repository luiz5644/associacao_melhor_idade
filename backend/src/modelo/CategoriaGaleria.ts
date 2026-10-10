export type PropsCategoriaGaleria = {
    id?: number,
    nome: string
}

export class CategoriaGaleria{
    private constructor(private props: PropsCategoriaGaleria )
    {}
    public static construir(
        id: number| undefined,
        nome:string
        
    ){
        if(!nome){
            throw new Error("Campos Obrigatórios")
        }

       const props: PropsCategoriaGaleria = {
        id,
        nome
       }

       return new CategoriaGaleria(props)

        
        
    }
    public static reconstruir(props:PropsCategoriaGaleria){
        return new CategoriaGaleria(props)
    }

    public get id(){
        return this.props.id
    }

    public get nome(){
        return this.props.nome
    }

    public toJSON(){
        return{
            id: this.props.id,
            nome: this.props.nome
        }
    }
}