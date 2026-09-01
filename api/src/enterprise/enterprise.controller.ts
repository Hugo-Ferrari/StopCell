import { EmpresaService } from './enterprise.service';
import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { EmpresaDto } from './dto/enterprise.dto';

@Controller('empresa')
export class EmpresaController {
    constructor(private readonly empresaService: EmpresaService){}
    @Post()
    cadastar(@Body()empresa : EmpresaDto){
        return this.empresaService.cadastrar(empresa  )
    }
    @Patch(":cnpj") 
    atualizar(@Param() cnpj: string,@Body() empresa: EmpresaDto, @Req() req){
        return this.empresaService.atualizar(cnpj, empresa, req.userCnpjEmpresa )
    }
}
