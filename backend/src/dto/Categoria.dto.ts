import { Type } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class categoriaDto {
    constructor(
        public id:number,
        public nome:string
    ){}
    

}

export class categoriaCreateDto{
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number

    @IsString()
    @IsNotEmpty()
    nome:string
}

export class categoriaUpdateDto{
    @IsString()
    @IsNotEmpty()
    nome:string
}

