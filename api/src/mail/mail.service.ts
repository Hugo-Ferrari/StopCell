import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? 587),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  async enviarCodigoRecuperacao(destinatario: string, codigo: string, validadeMin: number) {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      this.logger.warn('MAIL_USER/MAIL_PASS não configurados: e-mail não enviado.');
      return;
    }

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM ?? process.env.MAIL_USER,
      to: destinatario,
      subject: 'StopCell - Código para redefinir sua senha',
      text: `Seu código de recuperação é ${codigo}. Ele expira em ${validadeMin} minutos. Se você não pediu, ignore este e-mail.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;background:#141414;color:#fff;border-radius:16px">
          <h2 style="color:#F25C38;margin-top:0">StopCell</h2>
          <p>Use o código abaixo para redefinir sua senha:</p>
          <p style="font-size:34px;font-weight:bold;letter-spacing:8px;text-align:center;margin:24px 0">${codigo}</p>
          <p style="color:#a1a1aa;font-size:13px">Ele expira em ${validadeMin} minutos. Se você não pediu a recuperação, ignore este e-mail.</p>
        </div>`,
    });
  }
}
