import { Module } from '@nestjs/common';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { PerfilRepository } from './perfil.repository';

@Module({
  controllers: [PerfilController],
  providers: [PerfilService, PerfilRepository],
  exports: [PerfilRepository],
})
export class PerfilModule {}