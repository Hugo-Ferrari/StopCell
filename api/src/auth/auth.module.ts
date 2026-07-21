import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmpresaRepository } from '../empresa/empresa.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, EmpresaRepository, UsuarioRepository, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
