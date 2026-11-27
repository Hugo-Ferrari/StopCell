-- marca e categoria passam a poder ser de uma loja.
-- as que já existem ficam com cnpj_empresa vazio e viram a lista padrão do sistema

ALTER TABLE "marca" ADD COLUMN "cnpj_empresa" VARCHAR(14);
ALTER TABLE "categoria" ADD COLUMN "cnpj_empresa" VARCHAR(14);

CREATE INDEX "marca_cnpj_empresa_idx" ON "marca"("cnpj_empresa");
CREATE INDEX "categoria_cnpj_empresa_idx" ON "categoria"("cnpj_empresa");

ALTER TABLE "marca"
  ADD CONSTRAINT "marca_cnpj_empresa_fkey"
  FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "categoria"
  ADD CONSTRAINT "categoria_cnpj_empresa_fkey"
  FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj")
  ON DELETE RESTRICT ON UPDATE CASCADE;