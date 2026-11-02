import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientesService } from './costumer.service';
import { CreateClienteDto } from '@/type/create-customer.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guards';
import { Permissao } from '@/common/decorators/permissao.decorator'; // <- novo
import { PERMISSOES } from '@/common/permissoes/catalogo'; // <- novo

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {} // instanciando o ClientesService por meio de construtor
  @UseGuards(JwtAuthGuard)
  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER) // <- novo
  @Get()
  listarCliente(@Req() req: any) {
    return this.clientesService.listaCliente(req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_VER, PERMISSOES.HISTORICO_VER) // <- novo
  @Get(':cpf')
  buscarPorId(@Param('cpf') cpf: string, @Req() req: any) {
    return this.clientesService.buscarPorId(cpf, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Post()
  criarClientePorId(@Body() dto: CreateClienteDto, @Req() req: any) {
    return this.clientesService.criarCliente(dto, req.userCnpjEmpresa);
  }

  @Permissao(PERMISSOES.ORDENS_EDITAR) // <- novo
  @Delete(':cpf')
  deletarPorid(@Param('cpf') cpf: string, @Req() req: any) {
    return this.clientesService.removerPorId(cpf, req.userCnpjEmpresa);
  }
}