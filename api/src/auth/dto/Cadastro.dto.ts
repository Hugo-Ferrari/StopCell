import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { EmpresaDto } from 'src/empresa/dto/empresa.dto';
import { UsuarioCadastroDto } from 'src/usuario/dto/Usuario.dto';

export class CadastroDto {

  @ValidateNested()
  @Type(() => EmpresaDto)
  empresa!: EmpresaDto;


  @ValidateNested()
  @Type(() => UsuarioCadastroDto)
  usuario!: UsuarioCadastroDto;
}