// empresa/empresa.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { EmpresaRepository } from './empresa.repository';
import { EmpresaDto } from './dto/empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(private readonly repository: EmpresaRepository) {}

  cadastrar(dto: EmpresaDto) {
    return this.repository.create(dto);
  }

  async atualizar(cnpj: string, dto: EmpresaDto) {
    const empresa = await this.repository.findByCnpj(cnpj);
    if (!empresa) throw new NotFoundException(`Empresa com CNPJ ${cnpj} não encontrada`);
    return this.repository.update(cnpj, dto);
  }
}