import { Injectable, NotFoundException } from '@nestjs/common';
import { OsChecklistRepository } from './os-checklist.repository';
import { SalvarChecklistOsDto } from '@/type/os-checklist.dto';

@Injectable()
export class OsChecklistService {
    constructor(private readonly repository: OsChecklistRepository) {}

    async atualizarStatus(ordemServicoId: number, checklistId: number, status: string, cnpjEmpresa: string) {
        const checklist = await this.repository.findByOrdemEChecklist(ordemServicoId, checklistId, cnpjEmpresa);

        if (!checklist) return null;

        return this.repository.atualizarStatus(ordemServicoId, checklistId, status, cnpjEmpresa);
    }

    async listarPorOs(numOs: number, cnpjEmpresa: string) {
        await this.garantirOs(numOs, cnpjEmpresa);
        return this.repository.listarPorOs(numOs, cnpjEmpresa);
    }

    async salvar(numOs: number, dto: SalvarChecklistOsDto, cnpjEmpresa: string) {
        await this.garantirOs(numOs, cnpjEmpresa);
        return this.repository.salvar(numOs, cnpjEmpresa, dto.itens);
    }

    private async garantirOs(numOs: number, cnpjEmpresa: string) {
        const os = await this.repository.findOs(numOs, cnpjEmpresa);

        if (!os) {
            throw new NotFoundException('Ordem de serviço não encontrada para esta empresa');
        }
    }
}