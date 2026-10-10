import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    ValidateIf
} from "class-validator";
import { Type } from "class-transformer";

export class AlbumDto{
    constructor(
        public id:number,
        public titulo: string
    ){}
}

export class AlbumCreateDto{
    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    id?:number

    @IsNumber()
    @IsNotEmpty()
    categoria_id: number

    @IsString()
    @IsNotEmpty()
    titulo:string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsString()
    @IsNotEmpty()
    date:string
}

export class AlbumUpdateDto{
     @IsOptional()
    @IsNumber()
    id?:number

    @IsNumber()
    @IsNotEmpty()
    categoria_id: number

    @IsString()
    @IsNotEmpty()
    titulo:string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsString()
    @IsNotEmpty()
    date:string

}