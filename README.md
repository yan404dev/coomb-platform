# Coomb - Monorepo

Plataforma de otimização de currículos com IA.

## Aviso Legal

Este código é propriedade de Yan Castro e está disponível apenas para fins de portfólio/demonstração. Uso comercial, cópia, modificação ou distribuição são estritamente proibidos sem autorização expressa.

Para licenciamento comercial ou uso autorizado, entre em contato através do repositório.

Veja [LICENSE](./LICENSE) para detalhes completos.

## Estrutura do Projeto

```
coomb/
├── packages/              # Serviços da aplicação
│   ├── api/              # Backend NestJS
│   ├── web/              # Frontend Next.js
│   └── ai/               # Serviço de IA Python/FastAPI
│
└── infrastructure/        # Infraestrutura
    ├── docker/           # Docker Compose
    └── aws/              # Terraform AWS
```

## Início Rápido

### Desenvolvimento Local

```bash
# Subir todos os serviços (usando docker-compose do root)
docker compose up -d --build

# Ou usando o docker-compose da pasta infrastructure
cd infrastructure/docker
docker compose up -d --build

# Ver logs
docker compose logs -f
```

### Serviços

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000

## Documentação

- [Arquitetura](./packages/api/ARCHITECTURE.md) - Arquitetura Hexagonal

## Arquitetura

O projeto segue **Arquitetura Hexagonal** (Ports & Adapters) e **Clean Architecture**:

- **Domain**: Regras de negócio puras
- **Application**: Casos de uso e orquestração
- **Infrastructure**: Implementações técnicas (HTTP, Database, etc.)

## Desenvolvimento

### Backend (NestJS)

```bash
cd packages/api
npm install
npm run start:dev
```

### Frontend (Next.js)

```bash
cd packages/web
npm install
npm run dev
```

### AI Service (Python)

```bash
cd packages/ai
pip install -r requirements.txt
uvicorn src.main:app --reload
```

## Monorepo

Este é um **monorepo** único contendo todos os serviços. Benefícios:

- Histórico Git unificado
- Facilita CI/CD
- Melhor organização
- Infraestrutura centralizada

## Deploy

Ver documentação em `infrastructure/aws/` para deploy na AWS.
