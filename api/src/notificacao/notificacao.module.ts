import { Module } from '@nestjs/common';
import { MailModule } from '@/mail/mail.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificacaoOsService } from './notificacao-os.service';


@Module({
  imports: [MailModule],
  providers: [NotificacaoOsService, PrismaService],
  exports: [NotificacaoOsService],
})
export class NotificacaoModule {}