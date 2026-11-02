import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { UsuarioService } from './user.service';
import { SomenteDono } from '@/common/decorators/permissao.decorator';
import { AtualizarFuncionarioDto, FuncionarioDto } from '@/type/funcionario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // qualquer usuário logado pode ver os próprios dados
  @Get('me')
  me(@Req() req: any) {
    return this.usuarioService.me(Number(req.user.sub));
  }

  @SomenteDono()
  @Get()
  listar(@Req() req: any) {
    return this.usuarioService.listar(req.userCnpjEmpresa);
  }

  @SomenteDono()
  @Post()
  criar(@Body() dto: FuncionarioDto, @Req() req: any) {
    return this.usuarioService.criar(dto, req.userCnpjEmpresa);
  }

  @SomenteDono()
  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarFuncionarioDto,
    @Req() req: any,
  ) {
    return this.usuarioService.atualizar(id, dto, req.userCnpjEmpresa);
  }
}