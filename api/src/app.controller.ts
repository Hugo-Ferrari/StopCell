import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() //expecificando que é um controller e que vai controlar um endpoint
export class AppController {
  constructor(private readonly appService: AppService) {} //instanciando o service com o construtor

}
