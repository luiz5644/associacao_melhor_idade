export type propsAdmin = {
    id?: number
    username: string,
    cpf: string,
    senha?: string
}
export class Admin{
       private constructor(
        private props:propsAdmin
    )
    {}
    public static construir(
        id: number | undefined,
        username:string,
        cpf:string,
        senha: string
    ){
        if(!username||!cpf){
            throw new Error("Os campos são Obrigatórios")
        }
        const props: propsAdmin ={
            id,
            username,
            cpf,
            senha,
        
        }
        return new Admin(props)
    }
    public static reconstruir(props:propsAdmin){
        return new Admin(props)

    }
    public alterarSenha(novaSenhaHash:string){
        this.props.senha = novaSenhaHash
    }
    public get username(){
        return this.props.username
    

    }
    public get cpf(){
        return this.props.cpf
    }
    public get senha(){
        return this.props.senha
    }
    public get id(){
        return this.props.id
    }
    

}
 