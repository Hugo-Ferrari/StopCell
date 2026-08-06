import { UsuarioCadastroDto } from 'src/user/dto/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UsuarioService } from './user.service';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Public()
    @Post('register')
    cadastrar(@Body() usuario: UsuarioCadastroDto) {
        return this.usuarioService.cadastrar(usuario);
    }
    
}