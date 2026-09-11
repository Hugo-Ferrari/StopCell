import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrdemServicoDto {

    @IsInt()
    @IsOptional()
    numOsAnterior?: number | null;

    @IsString()
    @IsNotEmpty()
    cpfCliente: string=''

    @IsString()
    @IsNotEmpty()
    imeiAparelho: string =''

    @IsInt()
    @IsNotEmpty()
    idUsuario: number=0

    @IsString()
    @IsOptional()
    diagnostico?: string;
}