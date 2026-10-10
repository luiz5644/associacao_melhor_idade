import { propsAdmin } from "./Admin"

export type PropsAlbum = {
    id?: number,
    categoria_id: number,
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
        categoria_id: number,
        titulo: string,
        description:string,
        date:string
    ){
        if(!categoria_id||!titulo||!date){
            throw new Error("Campus Obrigatórios")
        }
        const props:PropsAlbum = {
            id,
            categoria_id,
            description,
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
    public get categoria_id(){
        return this.props.categoria_id
    }
    public get description(){
        return this.props.description
    }
    public get date(){
        return this.props.date
    }
}