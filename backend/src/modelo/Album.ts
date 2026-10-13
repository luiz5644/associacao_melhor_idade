export type PropsAlbum = {
    id?: number,
    titulo: string,
    description: string
    date: string

}

export class Album{
    constructor(
        private props:PropsAlbum
    )
    {}

    public static construir(
        id: number|undefined,
        titulo: string,
        description:string | undefined,
        date:string
    ){
        if(!titulo||!date){
            throw new Error("Campus Obrigatórios")
        }
        const props:PropsAlbum = {
            id,
            description: description || '',
            titulo,
            date,

        }
        return new Album(props)

    }

    public static reconstruir(props:PropsAlbum){
        return new Album(props)
    }
    public get id (){
        return this.props.id
    }
    public get titulo (){
        return this.props.titulo
    } 
    public get description(){
        return this.props.description
    }
    public get date(){
        return this.props.date
    }
}
