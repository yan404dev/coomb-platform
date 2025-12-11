# Coomb - AI-Powered Resume Optimization Platform

> Plataforma open source de otimização de currículos com Inteligência Artificial

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com/)

## Sobre o Projeto

Coomb é uma plataforma completa que utiliza IA para ajudar profissionais a otimizarem seus currículos. O sistema analisa experiências, habilidades e formações, oferecendo sugestões personalizadas e gerando currículos formatados profissionalmente.

### Principais Funcionalidades

- Chat com IA para otimização de currículos
- Importação de PDF/DOCX com extração automática de dados
- Templates profissionais para exportação
- Análise de completude e score de qualidade
- RAG com Qdrant para enriquecimento de contexto
- Otimização adaptada para vagas específicas

## Arquitetura

O projeto segue **Arquitetura Hexagonal** (Ports & Adapters) e **Clean Architecture** com princípios DDD:

```
coomb/
├── packages/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   └── [module]/
│   │   │   │       ├── domain/          # Entidades e regras de negócio
│   │   │   │       ├── application/     # Casos de uso
│   │   │   │       └── infrastructure/  # Adaptadores (HTTP, DB)
│   │   │   └── common/
│   │   └── prisma/             # Schema e migrations
│   │
│   ├── web/                    # Frontend Next.js 15
│   │   ├── src/
│   │   │   ├── app/            # App Router (Next.js 15)
│   │   │   └── shared/
│   │   │       ├── components/ # Componentes globais + providers
│   │   │       ├── entities/   # Entidades de domínio
│   │   │       ├── schemas/    # Validação Zod
│   │   │       ├── services/   # Services com classes
│   │   │       └── hooks/      # React hooks customizados
│   │   └── package.json
│   │
│   └── pdf/                    # Serviço de IA Python/FastAPI
│       ├── services/           # Lógica de negócio
│       ├── layouts/            # Templates de currículo
│       └── main.py
│
└── infrastructure/
    ├── docker/                 # Docker Compose
    └── aws/                    # Terraform AWS (ECS, RDS, S3)
```

### Princípios Arquiteturais

- **Hexagonal Architecture**: Separação clara entre domínio, aplicação e infraestrutura
- **MVVM Pattern** (Frontend): Model-View-ViewModel para componentes complexos
- **Server-First Architecture**: Server Actions e Components do Next.js 15
- **Entity-Driven Design**: Entidades como fonte única de verdade
- **Schema Validation**: Zod schemas com type inference (`z.infer<typeof schema>`)
- **Service Classes**: Métodos `add`, `update`, `remove`, `list` padronizados

## Stack Tecnológica

### Frontend

- **Next.js 15.5** - App Router, Server Components, Server Actions
- **React 19** - Componentes modernos
- **TypeScript 5.9** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **Zod** - Validação de schemas
- **SWR** - Cache e sincronização de dados

### Backend

- **NestJS 11** - Framework Node.js
- **Prisma 7** - ORM com migrations
- **PostgreSQL** - Banco de dados (Supabase)
- **OpenAI API** - Integração com GPT-4
- **Qdrant** - Vector database para RAG

### IA Service

- **FastAPI 0.115** - Framework Python assíncrono
- **OpenAI SDK** - Integração com modelos de IA
- **PyPDF2 & PDFPlumber** - Extração de texto de PDFs
- **python-docx** - Processamento de documentos Word
- **ReportLab** - Geração de PDFs profissionais

### Infraestrutura

- **Docker & Docker Compose** - Containerização
- **AWS ECS** - Orquestração de containers
- **AWS RDS** - PostgreSQL gerenciado
- **AWS S3** - Armazenamento de arquivos
- **Terraform** - Infrastructure as Code

## Início Rápido

### Pré-requisitos

- Node.js 24.x ou superior
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (ou use Supabase)

### Configuração do Ambiente

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/coomb.git
cd coomb
```

Configure as variáveis de ambiente:

```bash
# Backend API (.env)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
QDRANT_URL="http://localhost:6333"

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# AI Service (.env)
OPENAI_API_KEY="sk-..."
```

### Desenvolvimento com Docker (Recomendado)

```bash
# Subir todos os serviços
docker compose up -d --build

# Ver logs
docker compose logs -f

# Parar serviços
docker compose down
```

**Acessar:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- AI Service: http://localhost:8001
- Qdrant Dashboard: http://localhost:6333/dashboard

### Desenvolvimento Local (sem Docker)

#### Backend (NestJS)

```bash
cd packages/api

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# Iniciar em modo desenvolvimento
npm run start:dev
```

#### Frontend (Next.js)

```bash
cd packages/web

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Build de produção
npm run build
```

#### AI Service (Python)

```bash
cd packages/pdf

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
python main.py
```

## Scripts Úteis

### Backend

```bash
npm run start:dev        # Desenvolvimento
npm run build            # Build de produção
npm run test             # Testes unitários
npx prisma studio        # Interface visual do banco
npx prisma migrate dev   # Criar migration
```

### Frontend

```bash
npm run dev              # Desenvolvimento
npm run build            # Build de produção
npm run lint             # Linter
npm run type-check       # Verificação de tipos
```

## Banco de Dados

O projeto utiliza **Prisma 7** com PostgreSQL. Principais features:

- **Enums**: MessageRole, MessageContentType
- **Relations**: User -> Resume -> Experiences/Skills/etc
- **Soft Delete**: Campo `deletedAt` em registros relevantes
- **Timestamps**: `createdAt` e `updatedAt` automáticos
- **UUIDs**: Chaves primárias com `gen_random_uuid()`

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Reset do banco (cuidado!)
npx prisma migrate reset
```

## Integração com IA

### OpenAI GPT-4

- Análise e otimização de currículos
- Sugestões personalizadas de melhorias
- Extração estruturada de dados de PDFs

### RAG com Qdrant

- Armazenamento de embeddings
- Busca semântica de contexto
- Enriquecimento de respostas da IA

### Pipeline de Otimização

1. **Análise** - Score de completude e qualidade
2. **Enriquecimento** - RAG com contexto relevante
3. **Otimização** - Sugestões da IA
4. **Formatação** - Geração de PDF profissional

## Segurança

- **Autenticação**: JWT com Supabase Auth
- **Validação**: Zod schemas em toda aplicação
- **Rate Limiting**: Throttling no NestJS
- **CORS**: Configurado para ambientes específicos
- **Sanitização**: Inputs validados e sanitizados

## Testes

```bash
# Backend
cd packages/api
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage

# Frontend
cd packages/web
npm run test              # Jest tests
npm run test:watch        # Watch mode
```

## Deploy

### AWS com Terraform

```bash
cd infrastructure/aws

# Inicializar Terraform
terraform init

# Planejar mudanças
terraform plan

# Aplicar infraestrutura
terraform apply

# Destruir (cuidado!)
terraform destroy
```

### Docker em Produção

```bash
# Build de imagens
docker compose -f docker-compose.prod.yml build

# Deploy
docker compose -f docker-compose.prod.yml up -d
```

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenções de Código

- **TypeScript**: camelCase para variáveis/funções, PascalCase para classes/componentes
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)
- **Imports**: Ordenados (React -> libs -> local)
- **Componentes**: Um componente por arquivo
- **Schemas**: Zod para validação, inferência de tipos

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

**Yan Castro**

- GitHub: [@yanmcastro](https://github.com/yanmcastro)
- LinkedIn: [Yan Castro](https://linkedin.com/in/yanmcastro)

## Agradecimentos

- OpenAI pela API GPT-4
- Comunidade Next.js e NestJS
- Supabase pelo excelente BaaS
- Shadcn/ui pelos componentes

---

Se este projeto te ajudou, considere dar uma estrela no repositório.
