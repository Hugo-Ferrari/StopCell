import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClientesService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto/create-cliente.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guards';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {} // instanciando o ClientesService por meio de construtor
@UseGuards(JwtAuthGuard)
  @Get() //falando que o metodo que vamo usar é o get
  listarCliente(@Req() req: any) {
    return this.clientesService.listaCliente(req.userCnpjEmpresa as string);
  }
  @Get(":cpf")
  buscarPorId(@Param("cpf") cpf: string, @Req() req: any) {
    return this.clientesService.buscarPorId(cpf, req.userCnpjEmpresa as string);
  }

  @Post()
  criarClientePorId(@Body() dto: CreateClienteDto, @Req() req: any) {
    return this.clientesService.criarCliente(dto, req.userCnpjEmpresa as string);
  }

  @Delete(":cpf")
  deletarPorid(@Param("cpf") cpf:string, @Req() req: any ){
    return this.clientesService.removerPorId(cpf, req.userCnpjEmpresa as string);
  }

}
