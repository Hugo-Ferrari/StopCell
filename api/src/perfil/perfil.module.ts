import { Module } from '@nestjs/common';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { PerfilRepository } from './perfil.repository';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [PerfilController],
  providers: [PerfilService, PerfilRepository, PrismaService],
  exports: [PerfilRepository],
})
export class PerfilModule {}