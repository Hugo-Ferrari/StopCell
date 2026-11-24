import { Module } from '@nestjs/common';
import { MailModule } from '@/mail/mail.module';
import { NotificacaoOsService } from './notificacao-os.service';


@Module({
  imports: [MailModule],
  providers: [NotificacaoOsService],
  exports: [NotificacaoOsService],
})
export class NotificacaoModule {}