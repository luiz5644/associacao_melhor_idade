import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsIn,
    MaxLength,
    Matches,

} from "class-validator";
import { Type } from "class-transformer";

export class AcoesDto{
    constructor(
        public id: number,
        public titulo: string
    ){}
}

export class AcoesCreateDto{
    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    id?: number

    @IsNotEmpty()
    @IsString()
    @IsIn(['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'])
    dia_semana:string

    
    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, { message: "Horário de início inválido" })
    horario_inicio: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, { message: "Horário de término inválido" })
    horario_fim:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    local: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    responsavel:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    titulo:string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    url_imagem?: string

    @IsOptional()
    @IsString()
    @MaxLength(100)
    descricao_curta?: string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    orientacoes?: string
}

export class AcoesUpdateDto{
    @IsNotEmpty()
    @IsString()
    @IsIn(['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'])
    dia_semana:string

    
    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, { message: "Horário de início inválido" })
    horario_inicio: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, { message: "Horário de término inválido" })
    horario_fim:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    local: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    responsavel:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    titulo:string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    url_imagem?: string

    @IsOptional()
    @IsString()
    @MaxLength(100)
    descricao_curta?: string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    orientacoes?: string
}
