export type propsDepoimento = {
    id?:number,
    nome: string,
    papel: string,
    url_imagem: string,
    depoimento: string
}

export class Depoimento{
    constructor(private props:propsDepoimento)
    {}
    public static construir(
        id: number|undefined,
        nome:string,
        papel:string,
        url_imagem:string,
        depoimento:string
    )
    {
        if(!nome||!url_imagem||!depoimento){
            throw new Error("Campos Obrigatórios")
        }

        const props:propsDepoimento ={
            id,
            nome,
            papel,
            url_imagem,
            depoimento
        }
        return new Depoimento(props)
    }
    public static reconstruir(props:propsDepoimento){
        return new Depoimento(props)
    }
    public get id(){
        return this.props.id
    }
    public get nome(){
        return this.props.nome
    }
    public get papel(){
        return this.props.papel
    }
    public get url_imagem(){
        return this.props.url_imagem
    }
    public get depoimento(){
        return this.props.depoimento
    }
}
