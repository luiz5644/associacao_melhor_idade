export type PropsPatrocinador = {
    id?: number;
    nome: string;
    logo: string | null;
    category: string | null;
    websiteUrl: string | null;
    description: string | null;
    active: boolean;
};

export class Patrocinador {
    private constructor(private props: PropsPatrocinador) {}

    public static construir(props: PropsPatrocinador): Patrocinador {
        if (!props.nome?.trim()) throw new Error("Nome do patrocinador é obrigatório");
        return new Patrocinador({ ...props, nome: props.nome.trim(), active: props.active ?? true });
    }

    public static reconstruir(props: PropsPatrocinador): Patrocinador {
        return new Patrocinador({ ...props, active: Boolean(props.active) });
    }

    public get id() { return this.props.id; }
    public get nome() { return this.props.nome; }
    public get logo() { return this.props.logo; }
    public get category() { return this.props.category; }
    public get websiteUrl() { return this.props.websiteUrl; }
    public get description() { return this.props.description; }
    public get active() { return this.props.active; }

    public toJSON(): PropsPatrocinador {
        return {
            id: this.id,
            nome: this.nome,
            logo: this.logo,
            category: this.category,
            websiteUrl: this.websiteUrl,
            description: this.description,
            active: this.active,
        };
    }
}
