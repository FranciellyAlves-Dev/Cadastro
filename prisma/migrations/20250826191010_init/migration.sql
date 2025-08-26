
CREATE TYPE "public"."TipoPessoa" AS ENUM ('CPF', 'CNPJ');

CREATE TABLE "public"."Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "tipo" "public"."TipoPessoa" NOT NULL,
    "cpf" TEXT,
    "cnpj" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."Endereco" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Cliente_email_key" ON "public"."Cliente"("email");


CREATE UNIQUE INDEX "Cliente_cpf_key" ON "public"."Cliente"("cpf");


CREATE UNIQUE INDEX "Cliente_cnpj_key" ON "public"."Cliente"("cnpj");


ALTER TABLE "public"."Endereco" ADD CONSTRAINT "Endereco_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
