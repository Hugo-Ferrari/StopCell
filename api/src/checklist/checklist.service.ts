import { Injectable } from '@nestjs/common';
import { ChecklistRepository } from './checklist.repository';
import { ChecklistDto } from './dto/checklist.dto';

@Injectable()
export class ChecklistService {
    constructor(private readonly repository: ChecklistRepository) {}

    registrar(dto: ChecklistDto, cnpjEmpresa: string) {
        return this.repository.registrar({ ...dto, cnpjEmpresa });
    }

    async atualizar(id: number, dto: ChecklistDto, cnpjEmpresa: string) {
        const total = await this.repository.existsById(id, cnpjEmpresa);

        if (total > 0) {
            return this.repository.atualizar(id, dto, cnpjEmpresa);
        }

        return null;
    }
}