# StopCell

Sistema de gestão para assistência técnica de celulares. A loja cadastra clientes e aparelhos, abre ordens de serviço (O.S.), acompanha o conserto, recebe o pagamento e vê o financeiro.

Cada loja (empresa) só enxerga os próprios dados. O dono da loja cadastra os funcionários e define o que cada um pode acessar.

## Sumário

- [O que o StopCell resolve](#o-que-o-stopcell-resolve)
- [Como o sistema funciona](#como-o-sistema-funciona)
- [Tecnologias](#tecnologias)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados e migrations](#banco-de-dados-e-migrations)
- [Usuários e permissões](#usuários-e-permissões)
- [Ordem de serviço](#ordem-de-serviço)
- [Rotas da API](#rotas-da-api)
- [Telas do sistema](#telas-do-sistema)
- [Scripts](#scripts)

## O que o StopCell resolve

Muitas assistências técnicas controlam o atendimento em papel, planilha ou WhatsApp. Isso gera problemas no dia a dia:

| Problema na loja | Como o StopCell resolve |
|---|---|
| Ordem de serviço em papel que se perde ou fica ilegível | A O.S. é digital, numerada e pode ser impressa em PDF com os dados do cliente, do aparelho e do serviço |
| Não saber se o aparelho já passou pela loja | Cliente e aparelho ficam cadastrados (por CPF e IMEI), com o histórico de O.S. anteriores |
| Discussão sobre o estado em que o aparelho chegou | Checklist de entrada registrado na abertura da O.S. |
| Cliente ligando para saber se o conserto ficou pronto | A cada mudança de status, o cliente recebe um e-mail automático |
| O.S. "esquecida" ou com status confuso | O status segue um fluxo definido (aberta → diagnóstico → aprovação → reparo → finalizado) e não pula etapas |
| Não saber quanto entrou e quanto saiu | Pagamentos e despesas ficam no financeiro, com resumos e gráficos por período e forma de pagamento |
| Funcionário vendo ou mexendo no que não deveria | O dono cria perfis de acesso e escolhe o que cada funcionário pode ver ou editar |
| Várias lojas usando o mesmo sistema | Cada loja só enxerga os próprios clientes, aparelhos, O.S. e financeiro |

## Como o sistema funciona

1. A loja se cadastra na tela de cadastro. Isso cria a empresa e o usuário **Dono**.
2. O dono cadastra os funcionários e os perfis de acesso.
3. No balcão, o atendente abre uma O.S.: escolhe ou cadastra o cliente (CPF), escolhe ou cadastra o aparelho (IMEI), preenche o checklist de entrada.
4. O técnico registra o diagnóstico, os serviços e as peças, e muda o status da O.S. até finalizar.
5. A cada mudança de status, o cliente recebe um e-mail (se tiver e-mail cadastrado).
6. O pagamento é registrado na O.S. (PIX, cartão etc.) e aparece no financeiro.
7. A O.S. pode ser impressa em PDF.

## Tecnologias

| Parte | Tecnologias |
|---|---|
| API (`api/`) | Node.js, NestJS 11, TypeScript, Prisma 7 (adapter `pg`), PostgreSQL, JWT, bcrypt, Nodemailer, Puppeteer (PDF), Swagger, Jest |
| Web (`web/`) | React 19, Vite 8, TypeScript, Tailwind CSS 4, React Router, Axios, Recharts |
| Banco | PostgreSQL (em produção, Neon) |
| E-mail | SMTP do Gmail (senha de app) |

## Estrutura do repositório

```text
StopCell/
├── api/                      Backend NestJS
│   ├── src/
│   │   ├── auth/             Login, cadastro da loja, recuperação de senha, guards
│   │   ├── common/           Decorators, filtro de erros do Prisma, catálogo de permissões
│   │   ├── prisma/           schema.prisma, migrations, seed e PrismaService
│   │   ├── ordem-servico/    O.S., regras de status, PDF
│   │   ├── notificacao/      E-mail para o cliente quando o status muda
│   │   ├── financeiro/       Resumos, gráficos e despesas
│   │   ├── type/             DTOs (validação do que chega na API)
│   │   └── ...               Um módulo por assunto (cliente, aparelho, pagamento, etc.)
│   ├── prisma.config.ts
│   └── .env.example
├── web/                      Frontend React
│   └── src/
│       ├── pages/            Telas (auth, orders, history, finance, settings)
│       ├── components/       Componentes das telas
│       ├── services/         Chamadas à API
│       ├── api/              Instância do Axios e token
│       └── context/, hooks/, layouts/, utils/ ...
└── .env.example              Modelo comentado das variáveis (API e web)
```

## Como rodar localmente

### Pré-requisitos

- Node.js 20.19 ou superior (o projeto é testado no Node 22)
- npm
- PostgreSQL, local ou em Docker

Se não tiver um Postgres, dá para subir um com Docker:

```bash
docker run -d --name stopcell-pg -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=stopcell postgres:16
```

### 1. API

```bash
cd api
npm install
cp .env.example .env        # preencha os valores (veja "Variáveis de ambiente")
npx prisma migrate deploy   # cria as tabelas no banco do DATABASE_URL
npx prisma generate         # gera o client do Prisma
npm run start:dev
```

A API sobe em `http://localhost:3000`.

A documentação Swagger fica em `http://localhost:3000/api/docs`. Ela só aparece quando `NODE_ENV` é diferente de `production`.

> Atenção: confira o `DATABASE_URL` antes de rodar `migrate deploy`. Nunca aponte para o banco de produção para testar.

### 2. Web

```bash
cd web
npm install
npm run dev
```

O site abre em `http://localhost:5173`. Sem a variável `VITE_API_URL`, ele chama a API em `http://localhost:3000`.

### 3. Primeiro acesso

Abra `http://localhost:5173/cadastro` e cadastre uma loja. O usuário criado é o **Dono** e tem acesso a tudo.

## Variáveis de ambiente

### API (`api/.env`)

| Variável | Obrigatória | Para que serve |
|---|---|---|
| `DATABASE_URL` | Sim | Conexão do PostgreSQL. Ex.: `postgresql://postgres:postgres@localhost:5432/stopcell` |
| `JWT_SECRET` | Sim | Chave que assina o token de login. Use um valor longo e aleatório |
| `PORT` | Não | Porta da API. Padrão `3000` |
| `CORS_ORIGIN` | Não | Endereços do site que podem chamar a API, separados por vírgula. Padrão `http://localhost:5173` |
| `NODE_ENV` | Não | Em `production` o Swagger é desligado |
| `MAIL_HOST` | Para e-mail | Servidor SMTP. Ex.: `smtp.gmail.com` |
| `MAIL_PORT` | Para e-mail | `587` (STARTTLS) ou `465` (SSL) |
| `MAIL_USER` | Para e-mail | Conta que envia os e-mails |
| `MAIL_PASS` | Para e-mail | Senha de app do Gmail (16 letras). O passo a passo está no `.env.example` da raiz |
| `MAIL_FROM` | Não | Remetente exibido. Ex.: `"StopCell <conta@gmail.com>"` |

Sem as variáveis de e-mail a API funciona, mas a recuperação de senha e os avisos de status da O.S. não são enviados.

### Web (`web/.env`)

| Variável | Obrigatória | Para que serve |
|---|---|---|
| `VITE_API_URL` | Não | Endereço da API. Padrão `http://localhost:3000` |

## Banco de dados e migrations

- O schema fica em `api/src/prisma/schema.prisma` e as migrations em `api/src/prisma/migrations/`.
- Para criar uma migration nova em desenvolvimento: altere o schema e rode `npx prisma migrate dev --name descricao_curta` (só contra um banco local).
- Em produção, use apenas `npx prisma migrate deploy`. Antes, rode `npx prisma migrate status` para ver o que vai ser aplicado.

Principais tabelas:

| Tabela | O que guarda |
|---|---|
| `empresa` | A loja (CNPJ é a chave) |
| `usuario`, `perfil_acesso` | Usuários da loja e os perfis de permissão |
| `cliente` | Clientes da loja (CPF único por loja) |
| `aparelho` | Aparelhos dos clientes (IMEI único por loja) |
| `categoria`, `marca` | Listas de categoria e marca de aparelho (globais, iguais para todas as lojas) |
| `ordem_servico` | A O.S., com status, cliente e aparelho |
| `diagnostico`, `itens_os`, `os_checklist`, `checklist` | Diagnóstico, serviços/peças e checklist da O.S. |
| `servico`, `peca` | Serviços e peças cadastrados pela loja |
| `pagamento`, `despesa` | Entradas e saídas do financeiro |
| `log_notificacao` | Registro dos e-mails de status enviados |
| `token_recuperacao_senha`, `log_login` | Recuperação de senha e histórico de login |

## Usuários e permissões

Existem dois níveis de usuário:

- **Dono**: criado no cadastro da loja. Tem todas as permissões e é o único que gerencia usuários e perfis.
- **Funcionário**: criado pelo dono. Recebe um perfil de acesso com as permissões abaixo.

| Permissão | O que libera |
|---|---|
| `ordens.ver` | Ver O.S., clientes e aparelhos |
| `ordens.editar` | Abrir e editar O.S., cadastrar clientes e aparelhos, diagnóstico, checklist e receber pagamento. Inclui `ordens.ver` |
| `historico.ver` | Consultar serviços já realizados |
| `financeiro.ver` | Ver pagamentos, despesas e o painel financeiro |
| `loja.editar` | Alterar nome, telefone e endereço da loja |

As permissões são conferidas no banco a cada requisição (`PermissoesGuard`). Se o dono mudar o perfil ou desativar alguém, vale na hora. Trocar a senha encerra as sessões abertas do usuário.

O token JWT vale por 8 horas, ou por 7 dias quando o usuário marca "Lembrar de mim".

Para criar uma tela nova com permissão própria, adicione a chave em `api/src/common/permissoes/catalogo.ts`. A tela de perfis mostra a opção sozinha.

## Ordem de serviço

Status possíveis e para onde cada um pode ir:

| Status atual | Pode ir para |
|---|---|
| Aberta | Em diagnóstico, Cancelado |
| Em diagnóstico | Em aprovação, Cancelado |
| Em aprovação | Em reparo, Em diagnóstico, Cancelado |
| Em reparo | Aguardando peça, Finalizado, Cancelado |
| Aguardando peça | Em reparo, Cancelado |
| Finalizado / Cancelado | Encerrada, não muda mais |

As regras ficam em `api/src/ordem-servico/status-os.ts`. Depois de cada mudança, a API tenta mandar um e-mail para o cliente. Se o envio falhar, a mudança de status não é desfeita, e o resultado fica em `log_notificacao`.

O PDF da O.S. é gerado com Puppeteer (Chrome sem tela). O Chrome é baixado no `npm install` da API.

## Rotas da API

Todas as rotas, menos as de `/auth`, exigem o header `Authorization: Bearer <token>`. A loja vem sempre do token, nunca do corpo da requisição.

| Recurso | Rotas | Permissão |
|---|---|---|
| `/auth` | `POST register`, `POST login`, `POST esqueci-senha`, `POST redefinir-senha` | Pública |
| `/usuario` | `GET me` (qualquer logado); `GET`, `POST`, `PATCH :id` | Só dono |
| `/perfis` | `GET permissoes` (qualquer logado); `GET`, `POST`, `PATCH :id`, `DELETE :id` | Só dono |
| `/empresa` | `GET minha` (qualquer logado); `PATCH minha` | `loja.editar` |
| `/clientes` | `GET`, `GET :cpf` | `ordens.ver` ou `historico.ver` |
| | `POST`, `DELETE :cpf` | `ordens.editar` |
| `/aparelho` | `GET`, `GET cliente/:cpf` | `ordens.ver` |
| | `GET opcoes` (categorias e marcas) | Qualquer logado |
| | `POST`, `PUT :imei`, `DELETE :imei` | `ordens.editar` |
| `/ordemServico` | `GET`, `GET :numOs`, `GET :numOs/pdf`, `GET aparelho/:imei/ultima` | `ordens.ver` ou `historico.ver` |
| | `POST`, `PATCH :numOs/status` | `ordens.editar` |
| `/diagnostico` | `POST` | `ordens.editar` |
| `/item-os` | `GET :numOs` | `ordens.ver` ou `historico.ver` |
| | `POST`, `DELETE :idItemOs` | `ordens.editar` |
| `/checklist` | `POST`, `PUT :id` | `ordens.editar` |
| `/os-checklist` | `GET :numOs` | `ordens.ver` ou `historico.ver` |
| | `PUT :numOs`, `PATCH :ordemServicoId/:checklistId/status` | `ordens.editar` |
| `/pagamento` | `POST` | `ordens.editar` |
| | `GET`, `GET :idPagamento` | `financeiro.ver` |
| | `GET os/:numOs` | `ordens.ver`, `historico.ver` ou `financeiro.ver` |
| `/financeiro` | `GET resumo`, `painel`, `recebimentos`, `ultimos-pagamentos`, `receitas-por-periodo`, `receitas-por-forma-pagamento`, `despesas-por-periodo`, `despesas`; `POST despesas`; `DELETE despesas/:id` | `financeiro.ver` |
| `/servico` | `POST` | `ordens.editar` ou `estoque.editar` |
| | `PUT :id` | `estoque.editar` |
| `/peca` | `GET` | `estoque.ver` ou `ordens.editar` |
| | `POST`, `PUT :id` | `estoque.editar` |
| `/categoria` | `POST`, `PUT :id` | `ordens.editar` ou `estoque.editar` |
| `/marca` | `GET :nome` (qualquer logado); `POST`, `PUT :id` | `ordens.editar` ou `estoque.editar` |

Detalhes de cada rota (corpo, respostas) estão no Swagger.

## Telas do sistema

| Caminho | Tela |
|---|---|
| `/` | Login |
| `/cadastro` | Cadastro da loja e do dono |
| `/recuperarSenha` | Recuperar senha por código no e-mail |
| `/ordemServico` | Lista de O.S. |
| `/nova-ordem-servico` | Abrir O.S. (cliente, aparelho, checklist) |
| `/ordemServico/:numOs` | Detalhe da O.S. (status, diagnóstico, itens, pagamento, PDF) |
| `/ordemServico/:numOs/checklist` | Checklist da O.S. |
| `/historico` | Serviços já realizados |
| `/financeiro` | Painel financeiro e despesas |
| `/configuracoes` | Menu de configurações |
| `/configuracoes/loja` | Dados da loja |
| `/configuracoes/perfil` | Dados e senha do usuário logado |
| `/configuracoes/usuarios` | Usuários e perfis de acesso (só dono) |

## Scripts

### API (`api/`)

| Comando | O que faz |
|---|---|
| `npm run start:dev` | Sobe a API recarregando a cada alteração |
| `npm run build` | Compila para `dist/` |
| `npm run start:prod` | Roda a versão compilada (`node dist/main`) |
| `npm test` | Testes unitários (Jest) |
| `npm run test:cov` | Testes com cobertura |
| `npm run lint` | ESLint (corrige o que der automaticamente) |
| `npm run format` | Prettier |

### Web (`web/`)

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o site em modo desenvolvimento |
| `npm run build` | Checa os tipos e gera o build em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |
