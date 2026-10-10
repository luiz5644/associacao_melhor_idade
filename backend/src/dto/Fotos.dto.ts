import "reflect-metadata";
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class FotoDto{
    constructor(
        public id:number,
        public url_imagem: string
    ){}
}

export class FotoCreateDto{
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    album_id: number

    @IsNotEmpty()
    @IsString()
    url_imagem:string

    @IsNotEmpty()
    @IsBoolean()
    eh_capa:boolean

    @IsOptional()
    @IsString()
    data_upload: string
}

export class FotoUpadateDto{
    
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    album_id: number

    @IsNotEmpty()
    @IsString()
    url_imagem:string

    @IsNotEmpty()
    @IsBoolean()
    eh_capa:boolean
}