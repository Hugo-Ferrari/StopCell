// empresa/empresa.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async cadastrar(dto: EmpresaDto) {
    try {
      return await this.repository.create(dto);
    } catch (erro) {
      if ((erro as { code?: string })?.code === 'P2002') {
        throw new ConflictException('Já existe uma empresa cadastrada com esse CNPJ.');
      }
      throw erro;
    }
  }

  async atualizar(cnpj: string, dto: UpdateEmpresaDTO) {
  await this.buscarPorCnpj(cnpj);
  return this.repository.update(cnpj, dto);
}
}
