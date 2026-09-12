// estou mockando dados para não dar duplicidade no banco 

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categorias = ['Smartphone', 'Tablet', 'Notebook', 'Smartwatch', 'Outro'];
  const marcas = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'LG', 'Asus', 'Realme', 'Outra'];

  for (const cat of categorias) {
    await prisma.categoria.create({ data: { nmCategoria: cat } });
  }
  for (const marca of marcas) {
    await prisma.marca.create({ data: { nmMarca: marca } });
  }
  console.log('Banco mockado com sucesso!');
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());