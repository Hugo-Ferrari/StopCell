import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() //expecificando que é um controller e que vai controlar um endpoint
export class AppController {
  constructor(private readonly appService: AppService) {} //instanciando o service com o construtor

  @Get() //metodo Get
  getHello(): string {
    //tipando o retorno da função;
    return this.appService.getHello();
  }
  @Get('/ola')
  getOla(): string {
    return this.appService.getOla();
  }
}
