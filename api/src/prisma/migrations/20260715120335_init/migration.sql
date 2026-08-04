
CREATE TYPE "FormaPagamento" AS ENUM ('PIX', 'CARTAO');


CREATE TABLE "categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nm_categoria" VARCHAR(100),

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);


CREATE TABLE "marca" (
    "id_marca" SERIAL NOT NULL,
    "nm_marca" VARCHAR(100),

    CONSTRAINT "marca_pkey" PRIMARY KEY ("id_marca")
);


CREATE TABLE "checklist" (
    "id_checklist" SERIAL NOT NULL,
    "descricao" VARCHAR(100),

    CONSTRAINT "checklist_pkey" PRIMARY KEY ("id_checklist")
);


CREATE TABLE "cliente" (
    "cpf" VARCHAR(11) NOT NULL,
    "nm_completo" VARCHAR(100),
    "telefone" VARCHAR(20),
    "email" VARCHAR(100),
    "endereco" VARCHAR(150),

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("cpf")
);


CREATE TABLE "empresa" (
    "cnpj" VARCHAR(14) NOT NULL,
    "nome_fantasia" VARCHAR(100),
    "razao_social" VARCHAR(100),
    "telefone" VARCHAR(20),
    "endereco" VARCHAR(150),

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("cnpj")
);


CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "cnpj_empresa" VARCHAR(14),
    "nome" VARCHAR(100),
    "login" VARCHAR(50),
    "email_usuario" VARCHAR(100),
    "senha" VARCHAR(255),
    "nivel_acesso" VARCHAR(20),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);


CREATE TABLE "aparelho" (
    "imei" VARCHAR(50) NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_marca" INTEGER NOT NULL,
    "cpf_cliente" VARCHAR(11) NOT NULL,
    "modelo" VARCHAR(100),
    "cor" VARCHAR(50),
    "senha_aparelho" VARCHAR(255),
    "tipo_senha" VARCHAR(50),

    CONSTRAINT "aparelho_pkey" PRIMARY KEY ("imei")
);


CREATE TABLE "peca" (
    "id_peca" SERIAL NOT NULL,
    "descricao" VARCHAR(150),
    "valor" DECIMAL(10,2),
    "quantidade" INTEGER,

    CONSTRAINT "peca_pkey" PRIMARY KEY ("id_peca")
);


CREATE TABLE "servico" (
    "id_servico" SERIAL NOT NULL,
    "descricao" VARCHAR(150),
    "valor" DECIMAL(10,2),

    CONSTRAINT "servico_pkey" PRIMARY KEY ("id_servico")
);


CREATE TABLE "ordem_servico" (
    "num_os" SERIAL NOT NULL,
    "num_os_anterior" INTEGER,
    "cpf_cliente" VARCHAR(11) NOT NULL,
    "imei_aparelho" VARCHAR(50) NOT NULL,
    "cnpj_empresa" VARCHAR(14) NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "dt_entrada" TIMESTAMP(3),
    "dt_saida" TIMESTAMP(3),
    "status" VARCHAR(50),
    "vl_total" DECIMAL(10,2),
    "diagnostico" TEXT,

    CONSTRAINT "ordem_servico_pkey" PRIMARY KEY ("num_os")
);


CREATE TABLE "itens_os" (
    "id_item_os" SERIAL NOT NULL,
    "num_os" INTEGER NOT NULL,
    "id_servico" INTEGER,
    "id_peca" INTEGER,
    "quantidade" INTEGER,
    "valor_unitario" DECIMAL(10,2),

    CONSTRAINT "itens_os_pkey" PRIMARY KEY ("id_item_os")
);


CREATE TABLE "diagnostico" (
    "id_diagnostico" SERIAL NOT NULL,
    "num_os" INTEGER NOT NULL,
    "relato_tecnico" TEXT,
    "data_hora" TIMESTAMP(3),

    CONSTRAINT "diagnostico_pkey" PRIMARY KEY ("id_diagnostico")
);


CREATE TABLE "os_checklist" (
    "num_os" INTEGER NOT NULL,
    "id_checklist" INTEGER NOT NULL,
    "status" VARCHAR(20),

    CONSTRAINT "os_checklist_pkey" PRIMARY KEY ("num_os","id_checklist")
);


CREATE TABLE "log_notificacao" (
    "id_log_notificacao" SERIAL NOT NULL,
    "num_os" INTEGER NOT NULL,
    "cpf_cliente" VARCHAR(11) NOT NULL,
    "tipo_evento" VARCHAR(50),
    "dt_hora_envio" TIMESTAMP(3),
    "mensagem_texto" TEXT,
    "status_envio" VARCHAR(50),

    CONSTRAINT "log_notificacao_pkey" PRIMARY KEY ("id_log_notificacao")
);


CREATE TABLE "Pagamento" (
    "idPagamento" SERIAL NOT NULL,
    "Ordem_Servico_Num_Os" INTEGER NOT NULL,
    "Valor_pago" DECIMAL(10,2),
    "Dt_pagamento" TIMESTAMP(3),
    "Forma_pagamento" "FormaPagamento" NOT NULL,
    "chave_pix" VARCHAR(100),
    "txid" VARCHAR(100),
    "qr_code" VARCHAR(500),
    "num_parcelas" INTEGER,
    "bandeira" VARCHAR(50),
    "tipo_cartao" VARCHAR(20),
    "ultimos_digitos" VARCHAR(4),

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("idPagamento")
);


CREATE UNIQUE INDEX "usuario_email_usuario_key" ON "usuario"("email_usuario");


ALTER TABLE "usuario" ADD CONSTRAINT "usuario_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE "aparelho" ADD CONSTRAINT "aparelho_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "aparelho" ADD CONSTRAINT "aparelho_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "marca"("id_marca") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "aparelho" ADD CONSTRAINT "aparelho_cpf_cliente_fkey" FOREIGN KEY ("cpf_cliente") REFERENCES "cliente"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_num_os_anterior_fkey" FOREIGN KEY ("num_os_anterior") REFERENCES "ordem_servico"("num_os") ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_cpf_cliente_fkey" FOREIGN KEY ("cpf_cliente") REFERENCES "cliente"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_imei_aparelho_fkey" FOREIGN KEY ("imei_aparelho") REFERENCES "aparelho"("imei") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_cnpj_empresa_fkey" FOREIGN KEY ("cnpj_empresa") REFERENCES "empresa"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "itens_os" ADD CONSTRAINT "itens_os_num_os_fkey" FOREIGN KEY ("num_os") REFERENCES "ordem_servico"("num_os") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "itens_os" ADD CONSTRAINT "itens_os_id_servico_fkey" FOREIGN KEY ("id_servico") REFERENCES "servico"("id_servico") ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE "itens_os" ADD CONSTRAINT "itens_os_id_peca_fkey" FOREIGN KEY ("id_peca") REFERENCES "peca"("id_peca") ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE "diagnostico" ADD CONSTRAINT "diagnostico_num_os_fkey" FOREIGN KEY ("num_os") REFERENCES "ordem_servico"("num_os") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "os_checklist" ADD CONSTRAINT "os_checklist_num_os_fkey" FOREIGN KEY ("num_os") REFERENCES "ordem_servico"("num_os") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "os_checklist" ADD CONSTRAINT "os_checklist_id_checklist_fkey" FOREIGN KEY ("id_checklist") REFERENCES "checklist"("id_checklist") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "log_notificacao" ADD CONSTRAINT "log_notificacao_num_os_fkey" FOREIGN KEY ("num_os") REFERENCES "ordem_servico"("num_os") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "log_notificacao" ADD CONSTRAINT "log_notificacao_cpf_cliente_fkey" FOREIGN KEY ("cpf_cliente") REFERENCES "cliente"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_Ordem_Servico_Num_Os_fkey" FOREIGN KEY ("Ordem_Servico_Num_Os") REFERENCES "ordem_servico"("num_os") ON DELETE RESTRICT ON UPDATE CASCADE;
