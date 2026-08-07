/*
  Warnings:

  - You are about to drop the column `cnpj_empresa` on the `aparelho` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj_empresa` on the `categoria` table. All the data in the column will be lost.
  - You are about to drop the column `cnpj_empresa` on the `marca` table. All the data in the column will be lost.
  - You are about to drop the `Pagamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "forma_pagamento_enum" AS ENUM ('PIX', 'CARTAO', 'DINHEIRO', 'BOLETO');

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_Ordem_Servico_Num_Os_fkey";

-- DropForeignKey
ALTER TABLE "aparelho" DROP CONSTRAINT "aparelho_cnpj_empresa_fkey";

-- DropForeignKey
ALTER TABLE "categoria" DROP CONSTRAINT "categoria_cnpj_empresa_fkey";

-- DropForeignKey
ALTER TABLE "marca" DROP CONSTRAINT "marca_cnpj_empresa_fkey";

-- AlterTable
ALTER TABLE "aparelho" DROP COLUMN "cnpj_empresa";

-- AlterTable
ALTER TABLE "categoria" DROP COLUMN "cnpj_empresa";

-- AlterTable
ALTER TABLE "marca" DROP COLUMN "cnpj_empresa";

-- DropTable
DROP TABLE "Pagamento";

-- DropEnum
DROP TYPE "FormaPagamento";

-- CreateTable
CREATE TABLE "pagamento" (
    "id_pagamento" SERIAL NOT NULL,
    "num_os" INTEGER NOT NULL,
    "valor_pago" DECIMAL(10,2),
    "dt_pagamento" TIMESTAMP(3),
    "forma_pagamento" "forma_pagamento_enum",
    "chave_pix" VARCHAR(100),
    "txid" VARCHAR(100),
    "qr_code" TEXT,
    "num_parcelas" INTEGER,
    "bandeira" VARCHAR(50),
    "tipo_cartao" VARCHAR(20),
    "ultimos_digitos" VARCHAR(4),

    CONSTRAINT "pagamento_pkey" PRIMARY KEY ("id_pagamento")
);

-- AddForeignKey
ALTER TABLE "pagamento" ADD CONSTRAINT "pagamento_num_os_fkey" FOREIGN KEY ("num_os") REFERENCES "ordem_servico"("num_os") ON DELETE RESTRICT ON UPDATE CASCADE;
