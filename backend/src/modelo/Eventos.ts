export type propsEventos = {
    id?: number;
    titulo: string;
    desc: string;
    data_completa: string;
    horario: string;
    local: string;
    is_highlight: boolean;
    status: string;
};

export class Eventos {
    private constructor(private props: propsEventos) {}

    public static construir(
        id: number | undefined,
        titulo: string,
        desc: string,
        data_completa: string,
        horario: string,
        local: string,
        is_highlight: boolean,
        status: string
    ): Eventos {
        // Validação corrigida: verifica se is_highlight foi fornecido sem bloquear 'false'
        if (
            !titulo ||
            !desc ||
            !data_completa ||
            !horario ||
            is_highlight === undefined ||
            !status
        ) {
            throw new Error("Campos obrigatórios ausentes");
        }

        const props: propsEventos = {
            id,
            titulo,
            desc,
            data_completa,
            horario,
            local,
            is_highlight,
            status
        };

        return new Eventos(props);
    }

    public static reconstruir(props: propsEventos): Eventos{
        return new Eventos(props);
    }

    public get id() {
        return this.props.id;
    }
    public get titulo() {
        return this.props.titulo;
    }
    public get desc() {
        return this.props.desc;
    }
    public get data_completa() {
        return this.props.data_completa;
    }
    public get horario() {
        return this.props.horario;
    }
    public get local() {
        return this.props.local;
    }
    public get is_highlight() {
        return this.props.is_highlight;
    }
    public get status() {
        return this.props.status;
    }
}