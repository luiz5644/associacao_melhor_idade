export type PropsFotos = {
    id?: number,
    album_id: number,
    url_imagem: string,
    eh_capa: boolean,
    data_upload?: string

}
export class Fotos{
    private constructor(private props:PropsFotos)
    {}
    public static construir(
        id:number|undefined,
        album_id:number,
        url_imagem:string,
        eh_capa: boolean,
        data_upload:string|undefined

    ){
        if(!album_id||!url_imagem||!eh_capa){
            throw new Error("Campos Obrigatórios")
        }
        const props: PropsFotos = {
            id,
            album_id,
            url_imagem,
            eh_capa,
            data_upload,

        }
        return new Fotos(props)
    }
    public static reconstruir(props:PropsFotos){
        return new Fotos(props)
    }

    public get id (){
        return this.props.id
    }
    public get album_id(){
        return this.props.album_id
    }
    public get url_imagem(){
        return this.props.url_imagem
    }
    public get eh_capa(){
        return this.props.eh_capa
    }
    public get data_upload(){
        return this.props.data_upload
    }

    public toJSON(){
        return{
            id: this.props.id,
            album_id: this.props.album_id,
            url_imagem: this.props.url_imagem,
            eh_capa: this.props.eh_capa,
            data_upload: this.props 
        }
    }
}