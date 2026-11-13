-- Cliente e aparelho passam a ser únicos por loja (cnpj_empresa + cpf / cnpj_empresa + imei).
-- Antes o CPF e o IMEI eram únicos no banco inteiro, então uma loja não conseguia cadastrar
-- um cliente ou aparelho que já tinha passado por outra.
--
-- Nenhum dado é apagado: as colunas novas são preenchidas com a loja de cada registro.
-- Como hoje o CPF e o IMEI não se repetem, todos os registros já obedecem às chaves novas.

-- 1. aparelho ganha a loja, copiada do dono (cliente)
ALTER TABLE "aparelho" ADD COLUMN "cnpj_empresa" VARCHAR(14);

UPDATE "aparelho" a
SET "cnpj_empresa" = c."cnpj_empresa"
FROM "cliente" c
WHERE c."cpf" = a."cpf_cliente";

-- 2. log_notificacao ganha a loja, copiada da O.S.
ALTER TABLE "log_notificacao" ADD COLUMN "cnpj_empresa" VARCHAR(14);

UPDATE "log_notificacao" l
SET "cnpj_empresa" = o."cnpj_empresa"
FROM "ordem_servico" o
WHERE o."num_os" = l."num_os";

-- 3. confere antes de trocar as chaves: se algo não bater, para sem alterar nada
DO $$
DECLARE
  aparelhos_sem_loja INT;
  logs_sem_loja INT;
  os_com_cliente_de_outra_loja INT;
  os_com_aparelho_de_outra_loja INT;
  logs_com_cliente_de_outra_loja INT;
BEGIN
  SELECT COUNT(*) INTO aparelhos_sem_loja FROM "aparelho" WHERE "cnpj_empresa" IS NULL;
  SELECT COUNT(*) INTO logs_sem_loja FROM "log_notificacao" WHERE "cnpj_empresa" IS NULL;

  SELECT COUNT(*) INTO os_com_cliente_de_outra_loja
  FROM "ordem_servico" o
  JOIN "cliente" c ON c."cpf" = o."cpf_cliente"
  WHERE c."cnpj_empresa" <> o."cnpj_empresa";

  SELECT COUNT(*) INTO os_com_aparelho_de_outra_loja
  FROM "ordem_servico" o
  JOIN "aparelho" a ON a."imei" = o."imei_aparelho"
  WHERE a."cnpj_empresa" <> o."cnpj_empresa";

  SELECT COUNT(*) INTO logs_com_cliente_de_outra_loja
  FROM "log_notificacao" l
  JOIN "cliente" c ON c."cpf" = l."cpf_cliente"
  WHERE c."cnpj_empresa" <> l."cnpj_empresa";

  IF aparelhos_sem_loja + logs_sem_loja + os_com_cliente_de_outra_loja
     + os_com_aparelho_de_outra_loja + logs_com_cliente_de_outra_loja > 0 THEN
    RAISE EXCEPTION 'Dados inconsistentes, migration cancelada: % aparelho(s) sem loja, % log(s) sem loja, % O.S. com cliente de outra loja, % O.S. com aparelho de outra loja, % log(s) com cliente de outra loja',
      aparelhos_sem_loja, logs_sem_loja, os_com_cliente_de_outra_loja,
      os_com_aparelho_de_outra_loja, logs_com_cliente_de_outra_loja;
  END IF;
END $$;

ALTER TABLE "aparelho" ALTER COLUMN "cnpj_empresa" SET NOT NULL;
ALTER TABLE "log_notificacao" ALTER COLUMN "cnpj_empresa" SET NOT NULL;

-- 4. tira as ligações antigas (só pelo CPF / IMEI)
ALTER TABLE "aparelho" DROP CONSTRAINT "aparelho_cpf_cliente_fkey";
ALTER TABLE "ordem_servico" DROP CONSTRAINT "ordem_servico_cpf_cliente_fkey";
ALTER TABLE "ordem_servico" DROP CONSTRAINT "ordem_servico_imei_aparelho_fkey";
ALTER TABLE "log_notificacao" DROP CONSTRAINT "log_notificacao_cpf_cliente_fkey";

-- 5. chaves novas: loja + CPF e loja + IMEI
ALTER TABLE "cliente" DROP CONSTRAINT "cliente_pkey";
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_pkey" PRIMARY KEY ("cnpj_empresa", "cpf");

ALTER TABLE "aparelho" DROP CONSTRAINT "aparelho_pkey";
ALTER TABLE "aparelho" ADD CONSTRAINT "aparelho_pkey" PRIMARY KEY ("cnpj_empresa", "imei");

-- 6. ligações novas, sempre dentro da mesma loja
ALTER TABLE "aparelho" ADD CONSTRAINT "aparelho_cnpj_empresa_cpf_cliente_fkey"
  FOREIGN KEY ("cnpj_empresa", "cpf_cliente") REFERENCES "cliente"("cnpj_empresa", "cpf")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_cnpj_empresa_cpf_cliente_fkey"
  FOREIGN KEY ("cnpj_empresa", "cpf_cliente") REFERENCES "cliente"("cnpj_empresa", "cpf")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_cnpj_empresa_imei_aparelho_fkey"
  FOREIGN KEY ("cnpj_empresa", "imei_aparelho") REFERENCES "aparelho"("cnpj_empresa", "imei")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "log_notificacao" ADD CONSTRAINT "log_notificacao_cnpj_empresa_cpf_cliente_fkey"
  FOREIGN KEY ("cnpj_empresa", "cpf_cliente") REFERENCES "cliente"("cnpj_empresa", "cpf")
  ON DELETE RESTRICT ON UPDATE CASCADE;
