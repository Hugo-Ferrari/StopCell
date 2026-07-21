import { IsString, IsNotEmpty } from 'class-validator';

export class EmpresaDto {
    @IsString()
    @IsNotEmpty()
    cnpj: string =''

    @IsString()
    @IsNotEmpty()
    nomeFantasia: string=''

    @IsString()
    @IsNotEmpty()
    razaoSocial: string=''

    @IsString()
    @IsNotEmpty()
    telefone: string=''

    @IsString()
    @IsNotEmpty()
    endereco: string=''
}