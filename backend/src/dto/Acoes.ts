import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

export class AcoesDto {
    constructor(
        public id: number,
        public nome: string,
       
    ) {}
}

export class AcoesCreateDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;

    @IsString()
    @IsNotEmpty()
    titulo!: string;

    @IsString()
    @IsNotEmpty()
    desc!: string;

    @IsNotEmpty()
    @IsString()
    data_completa!: string;

    @IsNotEmpty()
    @IsString()
    horario!: string;

    @IsNotEmpty()
    @IsString()
    local!: string;

    @IsBoolean()
    @Type(() => Boolean)
    is_highlight!: boolean;

    @IsNotEmpty()
    @IsString()
    status!: string;
}

export class AcoesUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id!: number;

    @IsOptional()
    @IsString()
    titulo?: string;

    @IsOptional()
    @IsString()
    desc?: string;

    @IsOptional()
    @IsString()
    data_completa?: string;

    @IsOptional()
    @IsString()
    horario?: string;

    @IsOptional()
    @IsString()
    local?: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_highlight?: boolean;

    @IsOptional()
    @IsString()
    status?: string;
}