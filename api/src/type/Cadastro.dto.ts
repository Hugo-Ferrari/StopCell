import { EmpresaDto } from '@/type/enterprise.dto';
import { UsuarioCadastroDto } from '@/type/user.dto';
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
