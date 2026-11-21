import { Module } from '@nestjs/common';
import { UsuarioController } from './user.controller';
import { UsuarioService } from './user.service';
import { UsuarioRepository } from './user.repository';
import { PerfilModule } from '@/perfil/perfil.module';

@Module({
  imports: [PerfilModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository],
})
export class UsuarioModule {}