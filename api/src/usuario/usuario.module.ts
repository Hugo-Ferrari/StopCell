import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { UsuarioRepository } from './usuario.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository, PrismaService],
})
export class UsuarioModule {}
