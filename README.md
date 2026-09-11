# StopCell - TIC

Sistema de gestão para assistência técnica e loja de celulares, com controle de clientes, aparelhos, serviços, ordens de serviço, pagamentos e relatórios operacionais.

## Visão geral

O projeto é composto por duas partes:

- API: backend em NestJS com Prisma e PostgreSQL
- Web: frontend em React + Vite + TypeScript

A aplicação foi pensada para controlar o fluxo de uma assistência técnica, desde o cadastro de clientes e dispositivos até a abertura e fechamento de ordens de serviço, incluindo diagnóstico, checklist, peças, serviços e recebimento de pagamentos.

## Stack tecnológica

### Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticação

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router

## Funcionalidades principais

- Cadastro e autenticação de usuários
- Gestão de empresas e dados multi-tenant
- Cadastro de clientes
- Cadastro de aparelhos por cliente
- Gestão de marcas, categorias, serviços e peças
- Registro de diagnósticos e checklists
- Abertura de ordem de serviço
- Emissão de itens de OS e status de atendimento
- Registro de pagamentos via PIX e cartão
- Interface para operação do setor de assistência técnica

## Estrutura do projeto

```bash
StopCell - TIC/
├── api/
│   ├── src/
│   ├── prisma/
│   ├── .env
│   ├── package.json
│   └── README.md
├── web/
│   ├── src/
│   ├── package.json
│   └── README.md
├── README.md
└── package.json (se houver no futuro)
```

## Requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 18 ou superior
- npm
- PostgreSQL

## Configuração do ambiente

### Backend

1. Acesse a pasta da API:

```bash
cd api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente. O projeto utiliza o arquivo `.env` na pasta `api` com variáveis como:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

> Caso o arquivo `.env` já exista no projeto, edite conforme o ambiente local.

4. Gere o cliente Prisma:

```bash
npx prisma generate
```

5. Inicie o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

A API ficará disponível em:

```bash
http://localhost:3000
```

#### Documentação Swagger

A API possui documentação interativa via Swagger disponível em:

```bash
http://localhost:3000/api/docs
```

Essa página permite testar os endpoints, consultar parâmetros e visualizar os schemas da API.

### Frontend

1. Acesse a pasta do frontend:

```bash
cd web
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie a aplicação:

```bash
npm run dev
```

A interface ficará disponível em:

```bash
http://localhost:5173
```

## Scripts úteis

### Backend

```bash
npm run start:dev
npm run build
npm run test
npm run lint
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Observações

- A API usa autenticação JWT protegendo rotas internas.
- O frontend foi configurado para se comunicar com o backend em `http://localhost:3000`.
- O projeto usa CORS para permitir a integração local entre frontend e backend.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para a funcionalidade
3. Realize as alterações
4. Abra um pull request

## Licença

Este projeto está em desenvolvimento e a licença pode ser definida conforme a necessidade da equipe ou do cliente.
