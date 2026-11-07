-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "id_perfil" INTEGER;

-- CreateTable
CREATE TABLE "perfil_acesso" (
    "id_perfil" SERIAL NOT NULL,
    "cnpj_empresa" VARCHAR(14) NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(150),
    "permissoes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfil_acesso_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfil_acesso_cnpj_empresa_nome_key" ON "perfil_acesso"("cnpj_empresa", "nome");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "perfil_acesso"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_acesso" ADD CONSTRAINT "perfil_acesso_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE CASCADE ON UPDATE CASCADE;