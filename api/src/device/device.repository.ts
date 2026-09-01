import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AparelhoDto } from './dto/device.dto';

@Injectable()
export class AparelhoRepository {
    constructor(private readonly prisma: PrismaService) {}

   async cadastro(dto: AparelhoDto, cnpjEmpresa: string) {
    const cliente = await this.prisma.cliente.findFirst({
        where: {
            cpf: dto.cpfCliente,
            cnpjEmpresa: cnpjEmpresa,
        },
    });

    if (!cliente) {
        throw new BadRequestException(
            'Cliente não pertence à empresa'
        );
    }

    return this.prisma.aparelho.create({
        data: dto,
    });
}

    atualizar(id: string, dto: AparelhoDto, cnpjEmpresa:string) {
        return this.prisma.aparelho.update({
            where: {
                imei: id,
                cliente:{
                    cnpjEmpresa:cnpjEmpresa
                }
            },
            data: dto,
        });
    }
    findById(id: string,cnpjEmpresa:string) {
        return this.prisma.aparelho.findFirst({
            where: {
                imei: id,
                cliente: {
                    cnpjEmpresa: cnpjEmpresa
                },
            },
        });
    }

    listar(cnpjEmpresa:string ) {
        return this.prisma.aparelho.findMany({
            where: {
                cliente: {
                    cnpjEmpresa:cnpjEmpresa
                },
            },
        });
    }

    listarPorCliente(cpfCliente: string, cnpjEmpresa:string) {
        return this.prisma.aparelho.findMany({
            where: {
                cpfCliente,
                cliente:{
                    cnpjEmpresa:cnpjEmpresa
                }
                
            },
        });
    }
}