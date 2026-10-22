import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class DepoimentoDto{
    constructor(
        public id: number,
        public nome: string
    )
    {}
}

export class DepoimentoCreateDto{
    @IsOptional()
    @IsNumber()
    @Type(()=>Number)

    id?: number

    @IsString()
    @IsNotEmpty()

    nome:string

    @IsNotEmpty()
    @IsString()

    papel:string

    @IsNotEmpty()
    @IsString()

    url_imagem:string

    @IsNotEmpty()
    @IsString()

    depoimento:string
}

export class DepoimentoUpdateDto{
    @IsString()
    @IsNotEmpty()

    nome:string

    @IsNotEmpty()
    @IsString()

    papel:string

    @IsNotEmpty()
    @IsString()

    url_imagem:string

    @IsNotEmpty()
    @IsString()

    depoimento:string

}
