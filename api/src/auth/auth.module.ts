import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmpresaRepository } from 'src/empresa/empresa.repository';
import { UsuarioRepository } from 'src/usuario/usuario.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '8h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmpresaRepository,
    UsuarioRepository,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}