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

export class AdminDto {
    constructor(
        public id: number,
        public username: string,
    ) {}
}

export class adminCreateDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;

    @IsNotEmpty({ message: "O nome de usuário é obrigatório" })
    @IsString()
    username!: string;

    @IsNotEmpty({ message: "O CPF é obrigatório" })
    @IsString()
    cpf!: string;

    @IsOptional()
    @ValidateIf((o) => o.senha !== undefined && o.senha !== null && o.senha !== "")
    @IsString()
    @MinLength(6, { message: "A senha deve ter pelo menos 6 caracteres" })
    senha?: string;
}

export class adminUpdateDto {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsOptional()
    @ValidateIf((o) => o.senha !== undefined && o.senha !== null && o.senha !== "")
    @IsString()
    @MinLength(6)
    senha?: string;
}