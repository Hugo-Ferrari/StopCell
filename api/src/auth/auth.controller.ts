import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { CadastroDto } from '@/type/Cadastro.dto';
import { LoginDto } from '@/type/Login.dto';
import { EsqueciSenhaDto } from '@/type/EsqueciSenha.dto';
import { RedefinirSenhaDto } from '@/type/RedefinirSenha.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  cadastrar(@Body() usuario: CadastroDto) {
    return this.authService.register(usuario);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('esqueci-senha')
  esqueciSenha(@Body() dto: EsqueciSenhaDto) {
    return this.authService.esqueciSenha(dto.email);
  }

  @Public()
  @Post('redefinir-senha')
  redefinirSenha(@Body() dto: RedefinirSenhaDto) {
    return this.authService.redefinirSenha(dto);
  }
}
