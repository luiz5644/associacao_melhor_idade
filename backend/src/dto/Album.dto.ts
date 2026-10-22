import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
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

    @IsString()
    @IsNotEmpty()
    titulo:string

    @IsOptional()
    @IsString()
    description?: string

    @IsString()
    @IsNotEmpty()
    date:string
}

export class AlbumUpdateDto{
     @IsOptional()
    @IsNumber()
    id?:number

    @IsString()
    @IsNotEmpty()
    titulo:string

    @IsOptional()
    @IsString()
    description?: string

    @IsString()
    @IsNotEmpty()
    date:string

}
