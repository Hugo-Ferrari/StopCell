import { Module } from '@nestjs/common';
import { UsuarioController } from './user.controller';
import { UsuarioService } from './user.service';
import { UsuarioRepository } from './user.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { PerfilModule } from '@/perfil/perfil.module';

@Module({
  imports: [PerfilModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository, PrismaService],
})
export class UsuarioModule {}