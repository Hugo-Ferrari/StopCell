-- AlterTable
ALTER TABLE "token_recuperacao_senha" ADD COLUMN     "tentativas" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "token" SET DATA TYPE VARCHAR(255);
