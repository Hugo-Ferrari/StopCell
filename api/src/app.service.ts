import { Injectable } from '@nestjs/common';

@Injectable() //service
export class AppService {
  // criando uma classe service
  getHello(): string {
    //tipando o tipo do retorno
    return 'Hello World!'; // esta retornando hello word
  }

  getOla(): string {
    return 'olá';
  }
}
