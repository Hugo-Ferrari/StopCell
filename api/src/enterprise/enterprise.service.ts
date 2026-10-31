// empresa/empresa.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { EmpresaRepository } from './enterprise.repository';
import { EmpresaDto, UpdateEmpresaDTO } from '@/type/enterprise.dto';

@Injectable()
export class EmpresaService {
  constructor(private readonly repository: EmpresaRepository) {}

  async buscarPorCnpj(cnpj: string) {
  const empresa = await this.repository.findByCnpj(cnpj);
  if (!empresa)
    throw new NotFoundException(`Empresa com CNPJ ${cnpj} não encontrada`);
  return empresa;
}

  cadastrar(dto: EmpresaDto) {
    return this.repository.create(dto);
  }

  async atualizar(cnpj: string, dto: UpdateEmpresaDTO) {
  await this.buscarPorCnpj(cnpj);
  return this.repository.update(cnpj, dto);
}
}
