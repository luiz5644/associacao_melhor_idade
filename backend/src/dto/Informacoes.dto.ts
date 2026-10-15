import { IsEmail, IsInt, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

export class InformacoesUpdateDto {
  @ValidateIf((_object, value) => value !== undefined && value !== "")
  @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(30) phone?: string;
  @IsOptional() @IsString() @MaxLength(255) address?: string;
  @IsOptional() @IsString() @MaxLength(255) pixKey?: string;
  @IsOptional() @IsString() @MaxLength(150) name?: string;
  @IsOptional() @IsString() @MaxLength(255) subtitle?: string;
  @IsOptional() @IsString() mission?: string;
  @IsOptional() @Type(() => Number) @IsInt() since?: number;
}
