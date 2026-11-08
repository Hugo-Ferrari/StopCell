import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';

// abrir um Chrome a cada impressão levava uns 2 segundos. aqui ele abre na
// primeira impressão e fica aberto, cada PDF só abre e fecha uma aba
@Injectable()
export class OsPdfService implements OnModuleDestroy {
  private readonly logger = new Logger(OsPdfService.name);
  private navegador?: Promise<puppeteer.Browser>;

  private obterNavegador() {
    if (!this.navegador) {
      this.navegador = puppeteer
        .launch()
        .then((navegador) => {
          // se o Chrome cair, a próxima impressão abre outro
          navegador.on('disconnected', () => (this.navegador = undefined));
          return navegador;
        })
        .catch((erro) => {
          this.navegador = undefined;
          throw erro;
        });
    }

    return this.navegador;
  }

  async gerar(html: string): Promise<Buffer> {
    let pagina: puppeteer.Page | undefined;

    try {
      const navegador = await this.obterNavegador();
      pagina = await navegador.newPage();
      await pagina.setContent(html, { waitUntil: 'load' });

      const pdf = await pagina.pdf({ format: 'A4', printBackground: true });
      return Buffer.from(pdf);
    } catch (erro) {
      // quase sempre é o Chrome do puppeteer que não foi baixado
      this.logger.error('Falha ao gerar o PDF da OS', erro);
      throw new InternalServerErrorException(
        'Não foi possível gerar o PDF. Confira se o Chrome do puppeteer está instalado (npx puppeteer browsers install chrome).',
      );
    } finally {
      await pagina?.close().catch(() => undefined);
    }
  }

  async onModuleDestroy() {
    const navegador = await this.navegador?.catch(() => undefined);
    await navegador?.close();
  }
}