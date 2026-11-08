import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtAuthGuard } from './auth/jwt.guards';
import { PermissoesGuard } from './auth/permissoes.guard';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './customer/customer.module';
import { EmpresaModule } from './enterprise/enterprise.module';
import { UsuarioModule } from './user/user.module';
import { PerfilModule } from './perfil/perfil.module';
import { PecaModule } from './peca/peca.module';
import { OsChecklistModule } from './os-checklist/os-checklist.module';
import { MarcaModule } from './marca/mark.module';
import { DiagnosticoModule } from './diagnosis/diagnosis.module';
import { ChecklistModule } from './checklist/checklist.module';
import { CategoriaModule } from './category/category.module';
import { AparelhoModule } from './device/device.module';
import { PagamentoModule } from './payment/payment.module';
import { OrdemServicoModule } from './ordem-servico/service-order.module';
import { ServicoModule } from './service/service.module';
import { ItensOsModule } from './item-os/item-os.module';

@Module({
  imports: [
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    AuthModule,
    ClientesModule,
    EmpresaModule,
    UsuarioModule,
    PerfilModule,
    PecaModule,
    OsChecklistModule,
    MarcaModule,
    DiagnosticoModule,
    ChecklistModule,
    CategoriaModule,
    AparelhoModule,
    PagamentoModule,
    OrdemServicoModule,
    ServicoModule,
    ItensOsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissoesGuard },
  ],
  exports: [PrismaService],
})
export class AppModule {}