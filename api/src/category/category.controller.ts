import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CategoriaService } from './category.service';
import { categoriaDto } from './dto/category.dto';

@Controller('categoria')
export class CategoriaController {
    constructor(private readonly service: CategoriaService){}

    @Post()
    cadastrar(@Body() dto: categoriaDto) {
        return this.service.cadastrar(dto);
    }

    @Put(':id')
    atualizar(@Param('id') id: string, @Body() dto: categoriaDto) {
        return this.service.atualizar(+id, dto);
    }
}
