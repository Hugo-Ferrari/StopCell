-- status da O.S. passa a ser enum. antes era texto livre, então qualquer valor
-- estranho que estiver no banco vira ABERTA antes de converter
CREATE TYPE "status_os_enum" AS ENUM (
  'ABERTA', 'DIAGNOSTICO', 'EM_APROVACAO', 'EM_REPARO', 'AGUARDANDO_PECA', 'FINALIZADO', 'CANCELADO'
);

UPDATE "ordem_servico"
SET "status" = 'ABERTA'
WHERE "status" IS NULL
   OR "status" NOT IN ('ABERTA', 'DIAGNOSTICO', 'EM_APROVACAO', 'EM_REPARO', 'AGUARDANDO_PECA', 'FINALIZADO', 'CANCELADO');

ALTER TABLE "ordem_servico"
  ALTER COLUMN "status" TYPE "status_os_enum" USING "status"::"status_os_enum",
  ALTER COLUMN "status" SET DEFAULT 'ABERTA',
  ALTER COLUMN "status" SET NOT NULL;

-- itens da O.S. guardam a própria descrição e o tipo (peça ou serviço)
CREATE TYPE "tipo_item_os_enum" AS ENUM ('PECA', 'SERVICO');

ALTER TABLE "itens_os"
  ADD COLUMN "tipo" "tipo_item_os_enum",
  ADD COLUMN "descricao" VARCHAR(150);

-- copia a descrição dos itens que já existem
UPDATE "itens_os" i
SET "tipo" = 'PECA', "descricao" = p."descricao"
FROM "peca" p
WHERE i."id_peca" = p."id_peca";

UPDATE "itens_os" i
SET "tipo" = 'SERVICO', "descricao" = s."descricao"
FROM "servico" s
WHERE i."id_servico" = s."id_servico" AND i."tipo" IS NULL;

UPDATE "itens_os" SET "tipo" = 'SERVICO' WHERE "tipo" IS NULL;
UPDATE "itens_os" SET "descricao" = 'Item sem descrição' WHERE "descricao" IS NULL OR "descricao" = '';

ALTER TABLE "itens_os"
  ALTER COLUMN "tipo" SET NOT NULL,
  ALTER COLUMN "descricao" SET NOT NULL;