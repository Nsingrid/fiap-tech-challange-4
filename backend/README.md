# FIAP Tech Challenge 2 - Backend API

API RESTful desenvolvida com **Express**, **TypeScript**, **Prisma ORM** e **PostgreSQL**, seguindo os princípios de **Clean Architecture** para gerenciamento financeiro.

## 🏗️ Arquitetura

Este projeto segue os princípios da **Clean Architecture**, separando responsabilidades em camadas bem definidas:

### 📦 Estrutura de Camadas

```
src/
├── domain/                 # Camada de Domínio (Regras de Negócio)
│   ├── entities/          # Entidades de domínio
│   ├── repositories/      # Interfaces de repositórios
│   └── use-cases/         # Casos de uso da aplicação
├── infrastructure/         # Camada de Infraestrutura
│   ├── database/          # Configuração do Prisma
│   ├── repositories/      # Implementação dos repositórios
│   └── services/          # Serviços externos (JWT, etc)
├── presentation/          # Camada de Apresentação
│   ├── controllers/       # Controllers HTTP
│   ├── middlewares/       # Middlewares Express
│   └── routes/            # Definição de rotas
└── shared/                # Código compartilhado
    ├── errors/            # Classes de erro
    └── types/             # Tipos compartilhados
```

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset JavaScript com tipagem
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização
- **JWT** - Autenticação via tokens
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas

## 📋 Pré-requisitos

- Node.js 20+
- Docker & Docker Compose
- npm ou yarn

## ⚙️ Instalação e Configuração

### 1. Clonar o repositório

```bash
cd apps/backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fiap_tech_challenge?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### 4. Iniciar banco de dados com Docker

```bash
docker-compose up -d postgres
```

### 5. Executar migrações do Prisma

```bash
npm run prisma:migrate
```

### 6. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 7. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## 🐳 Rodando com Docker Compose (Completo)

Para rodar a aplicação completa (backend + PostgreSQL):

```bash
docker-compose up
```

Isso irá:
- Criar container PostgreSQL
- Criar container da aplicação
- Executar migrações automaticamente
- Iniciar servidor em modo desenvolvimento

## 📚 Endpoints da API

### 🔐 Autenticação

#### Criar Usuário
```http
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "senha123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "senha123"
}
```
**Resposta:** Define cookies `authToken` (httpOnly) e `username`

#### Logout
```http
POST /api/auth/logout
```

### 👤 Usuários

#### Listar Usuários
```http
GET /api/users
```

### 💰 Contas

#### Obter Conta do Usuário
```http
GET /api/account
Cookie: authToken=<jwt-token>
```

**Resposta:**
```json
{
  "message": "Account retrieved successfully",
  "result": {
    "account": {
      "id": "uuid",
      "accountNumber": "123456",
      "accountType": "CHECKING",
      "balance": 10000
    },
    "cards": [],
    "transactions": [...]
  }
}
```

### 💸 Transações

#### Criar Transação
```http
POST /api/transactions
Cookie: authToken=<jwt-token>
Content-Type: application/json

{
  "type": "Credit",
  "value": 10000,
  "from": "Salário",
  "to": "Conta Corrente"
}
```

**Tipos:**
- `Credit` - Depósito (adiciona saldo)
- `Debit` - Saque (remove saldo)

**Valor:** Em centavos (10000 = R$ 100,00)

#### Listar Transações (Extrato)
```http
GET /api/transactions
Cookie: authToken=<jwt-token>
```

ou

```http
GET /api/statement
Cookie: authToken=<jwt-token>
```

### ✅ Health Check
```http
GET /api/health
```

## 🔑 Autenticação

A API utiliza **JWT (JSON Web Tokens)** armazenados em **cookies httpOnly** para segurança:

1. O usuário faz login com email/senha
2. Backend valida credenciais e gera JWT
3. JWT é enviado como cookie `authToken` (httpOnly, secure em produção)
4. Frontend envia cookie automaticamente em requisições
5. Middleware `authMiddleware` valida token em rotas protegidas

## 🗄️ Schema do Banco de Dados

### Users
```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  accounts  Account[]
}
```

### Accounts
```prisma
model Account {
  id            String   @id @default(uuid())
  userId        String
  accountNumber String   @unique
  accountType   String   @default("CHECKING")
  balance       BigInt   @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(...)
  transactions  Transaction[]
}
```

### Transactions
```prisma
enum TransactionType {
  Credit
  Debit
}

model Transaction {
  id        String          @id @default(uuid())
  accountId String
  type      TransactionType
  value     BigInt
  date      DateTime        @default(now())
  from      String?
  to        String?
  anexo     String?
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  account   Account         @relation(...)
}
```

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo watch

# Build
npm run build            # Compila TypeScript para JavaScript
npm start                # Inicia servidor em produção

# Prisma
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrações
npm run prisma:studio    # Abre Prisma Studio (GUI)
npm run prisma:seed      # Executa seed do banco
```

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ JWT com cookies httpOnly
- ✅ CORS configurado
- ✅ Validação de dados com Zod
- ✅ Prepared statements (Prisma)
- ⚠️ Em produção: use HTTPS e altere JWT_SECRET

## 📊 Prisma Studio

Para visualizar e editar dados via interface gráfica:

```bash
npm run prisma:studio
```

Acesse: `http://localhost:5555`

## 🐛 Tratamento de Erros

A API utiliza um middleware centralizado de erros:

```typescript
class AppError {
  message: string;
  statusCode: number;
}
```

Respostas de erro seguem o padrão:

```json
{
  "message": "Error message",
  "result": null
}
```

## 🌐 CORS

CORS está configurado para aceitar requisições de:
- `http://localhost:3000` (frontend Next.js)

Para adicionar outras origens, edite `src/server.ts`:

```typescript
cors({
  origin: ['http://localhost:3000', 'https://seu-dominio.com'],
  credentials: true,
})
```

## 📝 Padrões de Código

### Use Cases (Domain Layer)
- Contêm lógica de negócio pura
- Independentes de frameworks
- Utilizam interfaces de repositórios

### Repositories (Infrastructure Layer)
- Implementam interfaces do domínio
- Lidam com Prisma/banco de dados
- Convertem entre entidades e modelos Prisma

### Controllers (Presentation Layer)
- Validam entrada com Zod
- Instanciam use cases
- Retornam respostas HTTP padronizadas

## 🚧 Próximas Implementações

- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Paginação de transações
- [ ] Filtros avançados de extrato
- [ ] Gerenciamento de cartões
- [ ] Sistema de investimentos completo
- [ ] Testes unitários e integração
- [ ] Documentação Swagger/OpenAPI

## 📄 Licença

MIT

---

**Desenvolvido para FIAP Tech Challenge 2** 🎓
