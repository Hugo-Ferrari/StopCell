jest.mock('puppeteer', () => ({ launch: jest.fn() }));

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from './prisma.service';
import { ClientesRepository } from '@/customer/customer.repository';
import { AparelhoRepository } from '@/device/device.repository';
import { EmpresaRepository } from '@/enterprise/enterprise.repository';
import { OrdemServicoService } from '@/ordem-servico/service-order.service';
import { FinanceiroRepository } from '@/financeiro/financeiro.repository';
import { AuthService } from '@/auth/auth.service';

describe('PrismaModule (@Global)', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET ??= 'test-secret';

    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await moduleRef.init();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('compartilha a mesma instância de PrismaService entre todos os módulos', () => {
    const prismaGlobal = moduleRef.get(PrismaService);
    const extrairPrisma = (instancia: object) =>
      (instancia as { prisma: PrismaService }).prisma;

    expect(prismaGlobal).toBeDefined();
    expect(extrairPrisma(moduleRef.get(ClientesRepository))).toBe(prismaGlobal);
    expect(extrairPrisma(moduleRef.get(AparelhoRepository))).toBe(prismaGlobal);
    expect(extrairPrisma(moduleRef.get(EmpresaRepository))).toBe(prismaGlobal);
    expect(extrairPrisma(moduleRef.get(OrdemServicoService))).toBe(prismaGlobal);
    expect(extrairPrisma(moduleRef.get(FinanceiroRepository))).toBe(prismaGlobal);
    expect(extrairPrisma(moduleRef.get(AuthService))).toBe(prismaGlobal);
  });
});
