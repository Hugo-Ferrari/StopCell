import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
async function main() {
    console.log('Iniciando seed...');

    // 1. Empresa
    const empresa = await prisma.empresa.create({
        data: {
            cnpj: '38181114000158',
            nomeFantasia: 'W-PHONE',
            razaoSocial: 'W-Phone Assistencia Tecnica LTDA',
            telefone: '16993928306',
            endereco: 'Avenida Brasil 445, Vila Aparecida, Franca - SP',
        },
    });
    console.log('Empresa criada:', empresa.cnpj);

    // 2. Usuario (dono da empresa)
    const usuario = await prisma.usuario.create({
        data: {
            cnpjEmpresa: empresa.cnpj,
            nome: 'Colaborador Teste',
            login: 'colaborador',
            emailUsuario: 'colaborador@wphone.com',
            senha: '123456',
            nivelAcesso: 'ADMIN',
        },
    });
    console.log('Usuario criado:', usuario.idUsuario);

    // 3. Cliente (agora pertence a uma empresa)
    const cliente = await prisma.cliente.create({
        data: {
            cpf: '34070631801',
            cnpjEmpresa: empresa.cnpj,
            nmCompleto: 'Priscila Silva',
            telefone: '16992570018',
            email: 'priscila@teste.com',
            endereco: 'Rua Teste, 123',
        },
    });
    console.log('Cliente criado:', cliente.cpf);

    // 4. Categoria (agora pertence a uma empresa)
    const categoria = await prisma.categoria.create({
        data: {
            cnpjEmpresa: empresa.cnpj,
            nmCategoria: 'Celular',
        },
    });
    console.log('Categoria criada:', categoria.idCategoria);

    // 5. Marca (agora pertence a uma empresa)
    const marca = await prisma.marca.create({
        data: {
            cnpjEmpresa: empresa.cnpj,
            nmMarca: 'Apple',
        },
    });
    console.log('Marca criada:', marca.idMarca);

    // 6. Aparelho (agora pertence a uma empresa)
    const aparelho = await prisma.aparelho.create({
        data: {
            imei: '357367097817417',
            cnpjEmpresa: empresa.cnpj,
            idCategoria: categoria.idCategoria,
            idMarca: marca.idMarca,
            cpfCliente: cliente.cpf,
            modelo: 'iPhone XR',
            cor: 'Preto',
            senhaAparelho: '1234',
            tipoSenha: 'NUMERICA',
        },
    });
    console.log('Aparelho criado:', aparelho.imei);

    // 7. Servico (agora pertence a uma empresa)
    const servico = await prisma.servico.create({
        data: {
            cnpjEmpresa: empresa.cnpj,
            descricao: 'Troca da Frontal Touch/Display com aro premium',
            valor: 250.0,
        },
    });
    console.log('Servico criado:', servico.idServico);

    // 8. Ordem de Servico
    const ordemServico = await prisma.ordemServico.create({
        data: {
            cpfCliente: cliente.cpf,
            imeiAparelho: aparelho.imei,
            cnpjEmpresa: empresa.cnpj,
            idUsuario: usuario.idUsuario,
            dtEntrada: new Date(),
            status: 'APROVADO',
            vlTotal: 250.0,
        },
    });
    console.log('Ordem de Servico criada:', ordemServico.numOs);

    // 9. Diagnostico
    const diagnostico = await prisma.diagnostico.create({
        data: {
            numOs: ordemServico.numOs,
            relatoTecnico: 'Touch e Display quebrados, não acende',
            dataHora: new Date(),
        },
    });
    console.log('Diagnostico criado:', diagnostico.idDiagnostico);

    // 10. Item da OS (vincula o servico a essa ordem)
    const itemOs = await prisma.itensOs.create({
        data: {
            numOs: ordemServico.numOs,
            idServico: servico.idServico,
            quantidade: 1,
            valorUnitario: 250.0,
        },
    });
    console.log('Item OS criado:', itemOs.idItemOs);

    console.log('---');
    console.log(`Seed concluido! Teste o PDF em: GET /ordemServico/${ordemServico.numOs}/pdf`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });