import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class EmpresaDto {
  @Matches(/^\d{11}$/, {
    message: 'O documento deve conter exatamente 11 dígitos numéricos.',
  })
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
export class UpdateEmpresaDTO{
  @IsString()
  @IsNotEmpty()
  nomeFantasia: string = '';

  @IsString()
  @IsNotEmpty()
  razaoSocial: string = '';

  @IsString()
  @IsNotEmpty()
  telefone: string = '';

  @IsString()
  @IsNotEmpty()
  endereco: string = '';
}