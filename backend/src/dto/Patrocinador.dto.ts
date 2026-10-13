import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class PatrocinadorCreateDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    nome!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    logo?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    websiteUrl?: string | null;

    @IsOptional()
    @IsString()
    description?: string | null;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    active?: boolean;
}

export class PatrocinadorUpdateDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    nome?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    logo?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    websiteUrl?: string | null;

    @IsOptional()
    @IsString()
    description?: string | null;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    active?: boolean;
}
