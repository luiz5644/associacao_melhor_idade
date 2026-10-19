import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  

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
    dia_semana:string

    
    @IsNotEmpty()
    @IsString()
    horario_inicio: string

    @IsNotEmpty()
    @IsString()
    horario_fim:string

    @IsNotEmpty()
    @IsString()
    local: string

    @IsNotEmpty()
    @IsString()
    responsavel:string

    @IsNotEmpty()
    @IsString()
    titulo:string
}

export class AcoesUpdateDto{
     @IsNotEmpty()
    @IsString()
    dia_semana:string

    
    @IsNotEmpty()
    @IsString()
    horario_inicio: string

    @IsNotEmpty()
    @IsString()
    horario_fim:string

    @IsNotEmpty()
    @IsString()
    local: string

    @IsNotEmpty()
    @IsString()
    responsavel:string

    @IsNotEmpty()
    @IsString()
    titulo:string
}