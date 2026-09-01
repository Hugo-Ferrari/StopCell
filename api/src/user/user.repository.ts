
import { Injectable } from '@nestjs/common';

import { UsuarioCadastroDto } from './dto/user.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(emailUsuario: string, ) {
    return this.prisma.usuario.findFirst({ where: { emailUsuario } });
  }

  create(data: Omit<UsuarioCadastroDto, 'senha'> & { senha: string }) {
    return this.prisma.usuario.create({ data });
  }
}