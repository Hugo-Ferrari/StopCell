import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService - recuperação de senha', () => {
  const usuario = { idUsuario: 1, emailUsuario: 'a@a.com' };

  let prisma: any;
  let usuarioRepository: { findByEmail: jest.Mock };
  let mail: { enviarCodigoRecuperacao: jest.Mock };
  let service: AuthService;

  beforeEach(() => {
    prisma = {
      tokenRecuperacaoSenha: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      usuario: { update: jest.fn() },
      $transaction: jest.fn().mockResolvedValue([]),
    };
    usuarioRepository = { findByEmail: jest.fn() };
    mail = { enviarCodigoRecuperacao: jest.fn().mockResolvedValue(undefined) };
    service = new AuthService(prisma, usuarioRepository as any, {} as any, mail as any);
  });

  describe('esqueciSenha', () => {
    it('não envia e-mail se o usuário não existe e responde igual', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(null);

      const result = await service.esqueciSenha('x@x.com');

      expect(result.message).toMatch(/Se o e-mail estiver cadastrado/);
      expect(mail.enviarCodigoRecuperacao).not.toHaveBeenCalled();
    });

    it('bloqueia reenvio em menos de 60 segundos', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(usuario);
      prisma.tokenRecuperacaoSenha.findFirst.mockResolvedValue({ criadoEm: new Date() });

      await service.esqueciSenha('a@a.com');

      expect(mail.enviarCodigoRecuperacao).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('gera código de 6 dígitos, salva o hash e envia o e-mail', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(usuario);
      prisma.tokenRecuperacaoSenha.findFirst.mockResolvedValue(null);

      await service.esqueciSenha('a@a.com');

      const [email, codigo] = mail.enviarCodigoRecuperacao.mock.calls[0];
      expect(email).toBe('a@a.com');
      expect(codigo).toMatch(/^\d{6}$/);

      const { data } = prisma.tokenRecuperacaoSenha.create.mock.calls[0][0];
      expect(data.token).not.toBe(codigo);
      expect(await bcrypt.compare(codigo, data.token)).toBe(true);
      expect(data.expiraEm.getTime()).toBeGreaterThan(Date.now());
    });

    it('não falha se o envio do e-mail der erro', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(usuario);
      prisma.tokenRecuperacaoSenha.findFirst.mockResolvedValue(null);
      mail.enviarCodigoRecuperacao.mockRejectedValue(new Error('smtp'));

      await expect(service.esqueciSenha('a@a.com')).resolves.toBeDefined();
    });
  });

  describe('redefinirSenha', () => {
    const dto = { email: 'a@a.com', codigo: '123456', novaSenha: 'novaSenha1' };

    async function tokenValido(tentativas = 0) {
      return {
        idToken: 't1',
        token: await bcrypt.hash('123456', 4),
        tentativas,
      };
    }

    it('rejeita usuário inexistente', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(null);

      await expect(service.redefinirSenha(dto)).rejects.toThrow(BadRequestException);
    });

    it('rejeita quando não há código válido (expirado ou usado)', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(usuario);
      prisma.tokenRecuperacaoSenha.findFirst.mockResolvedValue(null);

      await expect(service.redefinirSenha(dto)).rejects.toThrow('Código inválido ou expirado');
    });

    it('incrementa tentativas quando o código está errado', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(usuario);
      prisma.tokenRecuperacaoSenha.findFirst.mockResolvedValue(await tokenValido(1));

      await expect(
        service.redefinirSenha({ ...dto, codigo: '000000' }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.tokenRecuperacaoSenha.update).toHaveBeenCalledWith({
        where: { idToken: 't1' },
        data: { tentativas: 2, usado: false },
      });
    });

    it('invalida o código na 5ª tentativa errada', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(usuario);
      prisma.tokenRecuperacaoSenha.findFirst.mockResolvedValue(await tokenValido(4));

      await expect(
        service.redefinirSenha({ ...dto, codigo: '000000' }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.tokenRecuperacaoSenha.update).toHaveBeenCalledWith({
        where: { idToken: 't1' },
        data: { tentativas: 5, usado: true },
      });
    });

    it('rejeita código já bloqueado por excesso de tentativas, mesmo se correto', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(usuario);
      prisma.tokenRecuperacaoSenha.findFirst.mockResolvedValue(await tokenValido(5));

      await expect(service.redefinirSenha(dto)).rejects.toThrow(BadRequestException);
      expect(prisma.usuario.update).not.toHaveBeenCalled();
    });

    it('troca a senha com hash e marca o código como usado', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(usuario);
      prisma.tokenRecuperacaoSenha.findFirst.mockResolvedValue(await tokenValido());

      const result = await service.redefinirSenha(dto);

      expect(result.message).toMatch(/sucesso/);
      const { data } = prisma.usuario.update.mock.calls[0][0];
      expect(data.senha).not.toBe(dto.novaSenha);
      expect(await bcrypt.compare(dto.novaSenha, data.senha)).toBe(true);
      expect(prisma.tokenRecuperacaoSenha.update).toHaveBeenCalledWith({
        where: { idToken: 't1' },
        data: { usado: true },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
