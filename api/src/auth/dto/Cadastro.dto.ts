import { EmpresaDto } from '@/enterprise/dto/enterprise.dto';
import { UsuarioCadastroDto } from '@/user/dto/user.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';


export class CadastroDto {

  @ValidateNested()
  @Type(() => EmpresaDto)
  empresa!: EmpresaDto;


  @ValidateNested()
  @Type(() => UsuarioCadastroDto)
  usuario!: UsuarioCadastroDto;
}