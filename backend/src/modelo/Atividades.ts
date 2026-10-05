export type propsAtividades = {
    id?: number;
    categoria_id: number;
    titulo: string;
    desc: string;
    data_completa: string;
    horario: string;
    local: string;
    is_highlight: boolean;
    status: string;
    categoria_nome?: string;
};

export class Atividades {
    private constructor(private props: propsAtividades) {}

    public static construir(
        id: number | undefined,
        categoria_id: number,
        titulo: string,
        desc: string,
        data_completa: string,
        horario: string,
        local: string,
        is_highlight: boolean,
        status: string
    ): Atividades {
        // Validação corrigida: verifica se is_highlight foi fornecido sem bloquear 'false'
        if (
            !categoria_id ||
            !titulo ||
            !desc ||
            !data_completa ||
            !horario ||
            is_highlight === undefined ||
            !status
        ) {
            throw new Error("Campos obrigatórios ausentes");
        }

        const props: propsAtividades = {
            id,
            categoria_id,
            titulo,
            desc,
            data_completa,
            horario,
            local,
            is_highlight,
            status
        };

        return new Atividades(props);
    }

    public static reconstruir(props: propsAtividades): Atividades {
        return new Atividades(props);
    }

    public get id() {
        return this.props.id;
    }
    public get categoria_id() {
        return this.props.categoria_id;
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
    public get categoria_nome() {
        return this.props.categoria_nome;
    }
    public toJSON() {
        return {
            id: this.props.id,
            categoria_id: this.props.categoria_id,
            titulo: this.props.titulo,
            desc: this.props.desc,
            data_completa: this.props.data_completa,
            horario: this.props.horario,
            local: this.props.local,
            is_highlight: this.props.is_highlight,
            status: this.props.status,
            categoria_nome: this.props.categoria_nome
        };
    }
}