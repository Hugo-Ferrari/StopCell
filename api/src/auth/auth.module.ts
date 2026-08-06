import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmpresaRepository } from 'src/enterprise/enterprise.repository';
import { UsuarioRepository } from 'src/user/user.repository';
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