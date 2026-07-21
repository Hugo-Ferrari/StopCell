
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioCadastroDto } from './dto/Usuario.dto';

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(emailUsuario: string) {
    return this.prisma.usuario.findFirst({ where: { emailUsuario } });
  }

  create(data: Omit<UsuarioCadastroDto, 'senha'> & { senha: string }) {
    return this.prisma.usuario.create({ data });
  }
}