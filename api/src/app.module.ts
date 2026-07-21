import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/cliente.module';
import { PrismaService } from './prisma/prisma.service';
import { EmpresaModule } from './empresa/empresa.module';
import { UsuarioModule } from './usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { PecaModule } from './peca/peca.module';
import { OsChecklistModule } from './os-checklist/os-checklist.module';
import { MarcaModule } from './marca/marca.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { ChecklistModule } from './checklist/checklist.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AparelhoModule } from './aparelho/aparelho.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { PagamentoCartaoModule } from './pagamento-cartao/pagamento-cartao.module';
import { PagamentoPixModule } from './pagamento-pix/pagamento-pix.module';
import { OrdemServicoModule } from './ordem-servico/ordem-servico.module';
import { ServicoModule } from './servico/servico.module';
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
