/*
  Warnings:

  - Added the required column `cnpj_empresa` to the `aparelho` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_empresa` to the `categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_empresa` to the `checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_empresa` to the `cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_empresa` to the `marca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_empresa` to the `peca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_empresa` to the `servico` table without a default value. This is not possible if the table is not empty.

*/

ALTER TABLE "aparelho" ADD COLUMN     "cnpj_empresa" VARCHAR(14) NOT NULL;


ALTER TABLE "categoria" ADD COLUMN     "cnpj_empresa" VARCHAR(14) NOT NULL;


ALTER TABLE "checklist" ADD COLUMN     "cnpj_empresa" VARCHAR(14) NOT NULL;


ALTER TABLE "cliente" ADD COLUMN     "cnpj_empresa" VARCHAR(14) NOT NULL;


ALTER TABLE "marca" ADD COLUMN     "cnpj_empresa" VARCHAR(14) NOT NULL;


ALTER TABLE "peca" ADD COLUMN     "cnpj_empresa" VARCHAR(14) NOT NULL;


ALTER TABLE "servico" ADD COLUMN     "cnpj_empresa" VARCHAR(14) NOT NULL;


ALTER TABLE "categoria" ADD CONSTRAINT "categoria_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "marca" ADD CONSTRAINT "marca_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "checklist" ADD CONSTRAINT "checklist_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "cliente" ADD CONSTRAINT "cliente_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "aparelho" ADD CONSTRAINT "aparelho_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "peca" ADD CONSTRAINT "peca_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "servico" ADD CONSTRAINT "servico_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
