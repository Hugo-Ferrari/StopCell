import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class EmpresaDto {
  @Matches(/^[0-9A-Z]{12}\d{2}$/, {
    message: 'O CNPJ deve ter 14 caracteres.',
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