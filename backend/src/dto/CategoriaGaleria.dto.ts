import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class CategoriaGaleriaDto{
    constructor(
        public id:number,
        public nome:string
    ){}
}

export class CategoriaCreateDto{
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number

    @IsNotEmpty()
    @IsString()

    nome:string
}

export class CategoriaUpdateDto{
      @IsNotEmpty()
    @IsString()

    nome:string
}

