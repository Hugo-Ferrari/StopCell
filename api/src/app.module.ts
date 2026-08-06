import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './customer/costumer.module';
import { PrismaService } from './prisma/prisma.service';
import { EmpresaModule } from './enterprise/enterprise.module';
import { UsuarioModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PecaModule } from './peca/peca.module';
import { OsChecklistModule } from './os-checklist/os-checklist.module';
import { MarcaModule } from './marca/mark.module';
import { DiagnosticoModule } from './diagnosis/diagnosis.module';
import { ChecklistModule } from './checklist/checklist.module';
import { CategoriaModule } from './category/category.module';
import { AparelhoModule } from './device/device.module';
import { PagamentoModule } from './payment/payment.module';
import { PagamentoCartaoModule } from './card-payment/card-payment.module';
import { PagamentoPixModule } from './pix-payment/pix-payment.module';
import { OrdemServicoModule } from './ordem-servico/service-order.module';
import { ServicoModule } from './service/service.module';
import { ItensOsModule } from './item-os/item-os.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.guards';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [ClientesModule, EmpresaModule, UsuarioModule, JwtModule.register({global: true, secret: process.env.JWT_SECRET}), PecaModule, OsChecklistModule, MarcaModule, DiagnosticoModule, ChecklistModule, CategoriaModule, AparelhoModule, PagamentoModule, PagamentoCartaoModule, PagamentoPixModule, OrdemServicoModule,ServicoModule, ItensOsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,{provide: APP_GUARD, useClass:JwtAuthGuard}],
  exports: [PrismaService],

})
export class AppModule {}
