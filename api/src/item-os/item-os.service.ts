import { Injectable, NotFoundException } from '@nestjs/common';
import { ItenOsRepository } from './itemOs.repository';
import { ItemOsDto } from './dto/itemOs.dto';

@Injectable()
export class ItemOsService {
    constructor(private readonly repository: ItenOsRepository){}

    async registrar(dto: ItemOsDto, cnpjEmpresa: string) {
        const ordemServico = await this.repository.findOsByNumAndCompany(dto.numOs, cnpjEmpresa);
        if (!ordemServico) {
            throw new NotFoundException('Ordem de serviço não encontrada para esta empresa');
        }

        return await this.repository.registrar(dto);
    }

    async findByNumOs(numOs: number, cnpjEmpresa: string) {
        return await this.repository.findByNumOs(numOs, cnpjEmpresa);
    }
}
