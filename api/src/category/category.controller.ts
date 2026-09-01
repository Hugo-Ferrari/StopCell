import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { CategoriaService } from './category.service';
import { categoriaDto } from './dto/category.dto';

@Controller('categoria')
export class CategoriaController {
    constructor(private readonly service: CategoriaService){}

    @Post()
    cadastrar(@Body() dto: categoriaDto, @Req() req: Request) {
        return this.service.cadastrar(dto);
    }

    @Put(':id')
    atualizar(@Param('id') id: string, @Body() dto: categoriaDto, @Req() req: Request) {
        return this.service.atualizar(+id, dto,req.userCnpjEmpresa as string);
    }
}
