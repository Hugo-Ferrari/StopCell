import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { IsCnpj } from '@/common/decorators/is-cnpj.decorator';

export class EmpresaDto {
    @IsCnpj()
    @IsString()
    @IsNotEmpty()
    cnpj: string =''

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nomeFantasia: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    razaoSocial: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    telefone: string=''

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    endereco: string=''
}
export class UpdateEmpresaDTO{
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nomeFantasia: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  razaoSocial: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  endereco: string = '';
}