import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
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
    @MaxLength(150)
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
    @MaxLength(200)
    local: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    responsavel:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    titulo:string
}

export class AcoesUpdateDto{
     @IsNotEmpty()
    @IsString()
    @MaxLength(150)
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
    @MaxLength(200)
    local: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    responsavel:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    titulo:string
}
