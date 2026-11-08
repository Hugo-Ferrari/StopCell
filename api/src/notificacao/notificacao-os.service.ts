import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';
import { montarEmailStatus } from './email-status.template';


// o que fica gravado em log_notificacao.status_envio
type ResultadoEnvio = 'ENVIADO' | 'FALHOU' | 'SEM_EMAIL' | 'NAO_CONFIGURADO';

@Injectable()
export class NotificacaoOsService {
  private readonly logger = new Logger(NotificacaoOsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  // chamado depois que o status já foi salvo. nunca lança erro: se o e-mail falhar,
  // a O.S. segue normal e a falha fica registrada no log pra aparecer na tela
  async avisarMudancaStatus(numOs: number) {
    try {
      const os = await this.prisma.ordemServico.findUnique({
        where: { numOs },
        include: {
          cliente: true,
          empresa: true,
          aparelho: { include: { marca: true } },
          itensOs: { orderBy: { idItemOs: 'asc' } },
        },
      });

      if (!os) return;

      const email = montarEmailStatus(os);
      const destinatario = os.cliente.email?.trim();

      let resultado: ResultadoEnvio;

      if (!destinatario) {
        resultado = 'SEM_EMAIL';
      } else if (!this.mail.estaConfigurado()) {
        resultado = 'NAO_CONFIGURADO';
      } else {
        try {
          await this.mail.enviar({
            para: destinatario,
            assunto: email.assunto,
            html: email.html,
            texto: email.texto,
            nomeRemetente: os.empresa.nomeFantasia ?? 'StopCell',
          });
          resultado = 'ENVIADO';
        } catch (erro) {
          this.logger.error(`Falha ao enviar e-mail da O.S. ${numOs}`, erro);
          resultado = 'FALHOU';
        }
      }

      await this.prisma.logNotificacao.create({
        data: {
          numOs,
          cpfCliente: os.cpfCliente,
          tipoEvento: os.status,
          dtHoraEnvio: new Date(),
          mensagemTexto: email.assunto,
          statusEnvio: resultado,
        },
      });
    } catch (erro) {
      this.logger.error(`Não foi possível registrar o aviso da O.S. ${numOs}`, erro);
    }
  }
}