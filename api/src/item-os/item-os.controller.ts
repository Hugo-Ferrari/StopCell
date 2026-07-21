import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ItemOsService } from './item-os.service';
import { ItemOsDto } from './dto/itemOs.dto';

@Controller('item-os')
export class ItemOsController {
    constructor(private readonly service: ItemOsService){}

    @Post()
    registrar(@Body() dto: ItemOsDto, @Req() req: any) {
        return this.service.registrar(dto, req.userCnpjEmpresa as string);
    }

    @Get(':numOs')
    findByNumOs(@Param('numOs') numOs: string, @Req() req: any) {
        return this.service.findByNumOs(+numOs, req.userCnpjEmpresa as string);
    }
}
