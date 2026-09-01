import { Body, Controller, Post } from '@nestjs/common';
import { UsuarioService } from './user.service';
import { Public } from '@/common/decorators/public.decorator';
import { UsuarioCadastroDto } from './dto/user.dto';


@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Public()
    @Post('register')
    cadastrar(@Body() usuario: UsuarioCadastroDto,) {
        return this.usuarioService.cadastrar(usuario,);
    }
    
}