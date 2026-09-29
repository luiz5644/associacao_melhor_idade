import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

export class AtividadeDto {
    constructor(
        public id: number,
        public nome: string,
        public status: string
    ) {}
}

export class AtividadeCreateDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    categoria_id!: number;

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

export class AtividadeUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    id!: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    categoria_id?: number;

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