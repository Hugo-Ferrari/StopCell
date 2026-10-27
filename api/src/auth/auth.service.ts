import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsuarioRepository } from '../user/user.repository';
import { MailService } from '../mail/mail.service';
import { CadastroDto } from '@/type/Cadastro.dto';
import { LoginDto } from '@/type/Login.dto';
import { RedefinirSenhaDto } from '@/type/RedefinirSenha.dto';

const CODIGO_VALIDADE_MIN = 15;
const INTERVALO_REENVIO_SEG = 60;
const MAX_TENTATIVAS = 5;
const MENSAGEM_ENVIO =
  'Se o e-mail estiver cadastrado, enviaremos um código de recuperação.';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usuarioRepository: UsuarioRepository,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
  ) {}

  async register(dto: CadastroDto) {
    const senhaHash = await bcrypt.hash(dto.usuario.senha, 10);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const empresaCriada = await tx.empresa.create({
          data: {
            cnpj: dto.empresa.cnpj,
            nomeFantasia: dto.empresa.nomeFantasia,
            razaoSocial: dto.empresa.razaoSocial,
            telefone: dto.empresa.telefone,
            endereco: dto.empresa.endereco,
          },
        });

        const usuarioCriado = await tx.usuario.create({
          data: {
            cnpjEmpresa: empresaCriada.cnpj,
            nome: dto.usuario.nome,
            login: dto.usuario.login,
            emailUsuario: dto.usuario.emailUsuario,
            senha: senhaHash,
            nivelAcesso: 'Dono',
          },
        });

        const usuarioSemSenha = { ...usuarioCriado } as Record<string, any>;
        delete usuarioSemSenha.senha;

        return {
          empresa: empresaCriada,
          usuario: usuarioSemSenha,
        };
      });

      return result;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Email ou CNPJ já cadastrados');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findByEmail(dto.emailUsuario);
    const senhaCorreta = usuario
      ? await bcrypt.compare(dto.senha, usuario.senha ?? '')
      : false;

    if (!usuario || !senhaCorreta) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = this.jwt.sign(
      {
        sub: usuario.idUsuario,
        email: usuario.emailUsuario,
        cnpjEmpresa: usuario.cnpjEmpresa,
      },
      { expiresIn: '8h' },
    );
    return { token };
  }

  async esqueciSenha(email: string) {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) return { message: MENSAGEM_ENVIO };

    const ultimo = await this.prisma.tokenRecuperacaoSenha.findFirst({
      where: { idUsuario: usuario.idUsuario },
      orderBy: { criadoEm: 'desc' },
    });
    const limite = Date.now() - INTERVALO_REENVIO_SEG * 1000;
    if (ultimo && ultimo.criadoEm.getTime() > limite) {
      return { message: MENSAGEM_ENVIO };
    }

    const codigo = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const hash = await bcrypt.hash(codigo, 10);

    await this.prisma.$transaction([
      this.prisma.tokenRecuperacaoSenha.updateMany({
        where: { idUsuario: usuario.idUsuario, usado: false },
        data: { usado: true },
      }),
      this.prisma.tokenRecuperacaoSenha.create({
        data: {
          idUsuario: usuario.idUsuario,
          token: hash,
          expiraEm: new Date(Date.now() + CODIGO_VALIDADE_MIN * 60 * 1000),
        },
      }),
    ]);

    try {
      await this.mail.enviarCodigoRecuperacao(email, codigo, CODIGO_VALIDADE_MIN);
    } catch (error) {
      this.logger.error('Falha ao enviar e-mail de recuperação', error as Error);
    }

    return { message: MENSAGEM_ENVIO };
  }

  async redefinirSenha(dto: RedefinirSenhaDto) {
    const erro = new BadRequestException('Código inválido ou expirado');

    const usuario = await this.usuarioRepository.findByEmail(dto.email);
    if (!usuario) throw erro;

    const token = await this.prisma.tokenRecuperacaoSenha.findFirst({
      where: {
        idUsuario: usuario.idUsuario,
        usado: false,
        expiraEm: { gt: new Date() },
      },
      orderBy: { criadoEm: 'desc' },
    });
    if (!token || token.tentativas >= MAX_TENTATIVAS) throw erro;

    const codigoCorreto = await bcrypt.compare(dto.codigo, token.token);
    if (!codigoCorreto) {
      const tentativas = token.tentativas + 1;
      await this.prisma.tokenRecuperacaoSenha.update({
        where: { idToken: token.idToken },
        data: { tentativas, usado: tentativas >= MAX_TENTATIVAS },
      });
      throw erro;
    }

    const senhaHash = await bcrypt.hash(dto.novaSenha, 10);
    await this.prisma.$transaction([
      this.prisma.usuario.update({
        where: { idUsuario: usuario.idUsuario },
        data: { senha: senhaHash },
      }),
      this.prisma.tokenRecuperacaoSenha.update({
        where: { idToken: token.idToken },
        data: { usado: true },
      }),
    ]);

    return { message: 'Senha redefinida com sucesso' };
  }
}
