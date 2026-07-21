import { Injectable } from '@nestjs/common';
import { OsChecklistRepository } from './os-checklist.repository';

@Injectable()
export class OsChecklistService {
    constructor(private readonly repository: OsChecklistRepository) {}

    async atualizarStatus(ordemServicoId: number, checklistId: number, status: string, cnpjEmpresa: string) {
        const checklist = await this.repository.findByOrdemEChecklist(ordemServicoId, checklistId, cnpjEmpresa);

        if (!checklist) return null;

        return this.repository.atualizarStatus(ordemServicoId, checklistId, status, cnpjEmpresa);
    }
}