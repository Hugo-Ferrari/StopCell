import { EmpresaDto } from "src/empresa/dto/empresa.dto";
import { UsuarioCadastroDto } from "src/usuario/dto/Usuario.dto";

export class CadastroDto{
    empresa!: EmpresaDto
    usuario!: UsuarioCadastroDto
}