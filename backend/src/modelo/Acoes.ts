export type propsAcoes = {
    id?: number,
    dia_semana: string,
    horario_inicio: string,
    horario_fim: string,
    local: string,
    responsavel: string
    titulo: string
}

export class Acoes{
    private constructor(private props: propsAcoes){

    }
    public static construir(
        id: number|undefined,
        dia_semana:string,
        horario_inicio: string,
        horario_fim: string,
        local:string,
        responsavel:string,
        titulo:string
    )
    {

         if (horario_fim <= horario_inicio) {
            throw new Error("O horário final deve ser posterior ao inicial");
        }
        if(!dia_semana||!horario_inicio||!horario_fim||!local||!responsavel||!titulo){
            throw new Error("Campos Obrigatórios")
        }
             
        const props:propsAcoes = {
            id,
            dia_semana,
            horario_inicio,
            horario_fim,
            local,
            responsavel,
            titulo
        }

        return new Acoes(props)
    }
    public static reconstruir(props:propsAcoes){
        return new Acoes(props)
    }

    public get id(){
        return this.props.id
    }
    public get dia_semana(){
        return this.props.dia_semana
    }
    public get horario_inicio(){
        return this.props.horario_inicio
    }
    public get horario_fim(){
        return this.props.horario_fim
    }
    public get local(){
        return this.props.local
    }
    public get responsavel(){
        return this.props.responsavel
    }
    public get titulo(){
        return this.props.titulo
    }
    
}