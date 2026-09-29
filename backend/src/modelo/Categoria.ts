export type propsCategoria = {
    id?: number,
    nome: string
}

export class Categoria {
    private constructor(
        private props:propsCategoria)
    {}
    public static construir(
        id:number|undefined,
        nome: string
    ){
        if(!nome){
            throw new Error("Campo Obrigatório")
        
        
    }
    const props: propsCategoria = {
        id,
        nome

    }
    return new Categoria(props)
   }
   public static reconstruir (props:propsCategoria){
    return new Categoria(props)
   }
  public get id() {
        return this.props.id
    }
    public get nome(){
        return this.props.nome
    }
    public toJSON() {
        return {
            id: this.props.id,
            nome: this.props.nome
        };
    }
}
    
