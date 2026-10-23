/*
  Warnings:

  - You are about to drop the column `quantidade` on the `peca` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "peca" DROP COLUMN "quantidade";

-- CreateTable
CREATE TABLE "token_recuperacao_senha" (
    "id_token" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "token" VARCHAR(6) NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_recuperacao_senha_pkey" PRIMARY KEY ("id_token")
);

-- CreateTable
CREATE TABLE "log_login" (
    "id_log_login" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "email_tentado" VARCHAR(100) NOT NULL,
    "sucesso" BOOLEAN NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_origem" VARCHAR(45),

    CONSTRAINT "log_login_pkey" PRIMARY KEY ("id_log_login")
);

-- CreateTable
CREATE TABLE "despesa" (
    "id_despesa" SERIAL NOT NULL,
    "cnpj_empresa" VARCHAR(14) NOT NULL,
    "descricao" VARCHAR(150) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data_despesa" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER,

    CONSTRAINT "despesa_pkey" PRIMARY KEY ("id_despesa")
);

-- CreateIndex
CREATE INDEX "token_recuperacao_senha_id_usuario_token_idx" ON "token_recuperacao_senha"("id_usuario", "token");

-- AddForeignKey
ALTER TABLE "token_recuperacao_senha" ADD CONSTRAINT "token_recuperacao_senha_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_login" ADD CONSTRAINT "log_login_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despesa" ADD CONSTRAINT "despesa_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despesa" ADD CONSTRAINT "despesa_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
