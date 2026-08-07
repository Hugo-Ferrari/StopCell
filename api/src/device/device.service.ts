import { Injectable } from '@nestjs/common';
import { AparelhoRepository } from './device.repository';
import { AparelhoDto } from './dto/device.dto';

@Injectable()
export class AparelhoService {
    constructor(private readonly repository: AparelhoRepository) {}

    async cadastro(dto: AparelhoDto) {
        
        return await this.repository.cadastro({ ...dto });
    }

    async listar() {
        return await this.repository.listar();
    }

    async atualizar(id: string, dto: AparelhoDto) {
        const aparelho = await this.repository.findById(id, );

        if (aparelho) return this.repository.atualizar(id, dto);

        return null;
    }
}