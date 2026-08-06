import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { EmpresaDto } from 'src/enterprise/dto/enterprise.dto';
import { UsuarioCadastroDto } from 'src/user/dto/user.dto';

export class CadastroDto {

  @ValidateNested()
  @Type(() => EmpresaDto)
  empresa!: EmpresaDto;


  @ValidateNested()
  @Type(() => UsuarioCadastroDto)
  usuario!: UsuarioCadastroDto;
}