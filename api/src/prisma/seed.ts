// estou mockando dados para não dar duplicidade no banco 

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categorias = ['Smartphone', 'Tablet', 'Notebook', 'Smartwatch', 'Outro'];
  const marcas = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'LG', 'Asus', 'Realme', 'Outra'];

  // só cria o que falta na lista padrão (sem loja): rodar de novo não duplica
  for (const nmCategoria of categorias) {
    const existe = await prisma.categoria.findFirst({ where: { nmCategoria, cnpjEmpresa: null } });
    if (!existe) await prisma.categoria.create({ data: { nmCategoria } });
  }
  for (const nmMarca of marcas) {
    const existe = await prisma.marca.findFirst({ where: { nmMarca, cnpjEmpresa: null } });
    if (!existe) await prisma.marca.create({ data: { nmMarca } });
  }
  console.log('Lista padrão de categorias e marcas conferida.');
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());