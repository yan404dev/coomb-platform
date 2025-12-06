# Arquitetura Hexagonal Global - Coomb API

Esta API segue **Hexagonal Architecture** (Ports & Adapters) e **Clean Architecture** de forma consistente em todos os módulos.

## Estrutura Padrão de Módulos

Todos os módulos seguem esta estrutura:

```
modules/[module]/
├── domain/                          # Camada de Domínio (Core)
│   ├── ports/                       # Interfaces (Ports)
│   │   ├── [entity].repository.port.ts
│   │   └── [external-service].port.ts
│   ├── entities/                    # Entidades de domínio
│   └── value-objects/               # Value Objects
│
├── application/                     # Camada de Aplicação
│   ├── use-cases/                   # Casos de Uso (Business Logic)
│   │   ├── create-[entity].use-case.ts
│   │   ├── update-[entity].use-case.ts
│   │   └── delete-[entity].use-case.ts
│   ├── services/                    # Services (Orquestração)
│   │   └── [module].service.ts
│   └── dto/                         # DTOs de aplicação
│
├── infrastructure/                  # Camada de Infraestrutura
│   ├── adapters/                    # Implementações (Adapters)
│   │   └── [port].adapter.ts
│   └── repositories/                # Repositories (se necessário)
│       └── [entity].repository.ts
│
├── controllers/                     # Controllers (HTTP)
│   └── [module].controller.ts
│
└── [module].module.ts              # Módulo NestJS
```

## Princípios Aplicados

### 1. **Hexagonal Architecture (Ports & Adapters)**

- **Ports**: Interfaces no `domain/ports/` que definem contratos
- **Adapters**: Implementações no `infrastructure/adapters/` que implementam os ports

**Exemplo:**

```typescript
// Port (Interface)
export interface ResumeRepositoryPort {
  findById(id: string): Promise<ResumeEntity>;
  save(resume: ResumeEntity): Promise<ResumeEntity>;
}

// Adapter (Implementação)
export class ResumeRepositoryAdapter implements ResumeRepositoryPort {
  // Implementação usando Prisma
}
```

### 2. **Dependency Inversion Principle (SOLID)**

- Camadas superiores dependem de abstrações (interfaces)
- Implementações concretas são injetadas via DI do NestJS

```typescript
// CORRETO: Depende da interface
class CreateResumeUseCase {
  constructor(
    @Inject("RESUME_REPOSITORY_PORT")
    private readonly repository: ResumeRepositoryPort
  ) {}
}

// ERRADO: Depende de implementação concreta
class CreateResumeUseCase {
  constructor(private readonly repository: ResumeRepository) {}
}
```

### 3. **Single Responsibility Principle**

- **Use Cases**: Uma responsabilidade por caso de uso
- **Services**: Orquestração e coordenação
- **Repositories**: Apenas acesso a dados
- **Adapters**: Apenas adaptação de interfaces

### 4. **Clean Architecture**

- **Domain**: Regras de negócio puras, sem dependências externas
- **Application**: Orquestra casos de uso
- **Infrastructure**: Implementa detalhes técnicos (Prisma, HTTP, etc.)

## Fluxo de Dados Padrão

```
HTTP Request
    ↓
Controller
    ↓
Service (Orquestração)
    ↓
Use Case (Business Logic)
    ↓
Repository Port (Interface)
    ↓
Repository Adapter (Prisma)
    ↓
Database
```

## Padrões de Nomenclatura

### Ports (Interfaces)

- `[Entity]RepositoryPort` - Para repositories
- `[Service]Port` - Para serviços externos
- Exemplo: `ResumeRepositoryPort`, `CoombAIClientPort`

### Adapters (Implementações)

- `[Port]Adapter` - Implementação do port
- Exemplo: `ResumeRepositoryAdapter`, `CoombAIClientAdapter`

### Use Cases

- `[Action][Entity]UseCase` - Verbo + Entidade
- Exemplo: `CreateResumeUseCase`, `UpdateResumeUseCase`

### Services

- `[Module]Service` - Orquestração do módulo
- Exemplo: `ResumeService`, `ChatService`

## Testabilidade

Com esta arquitetura, é fácil criar mocks:

```typescript
// Mock do Repository Port
const mockRepository: ResumeRepositoryPort = {
  findById: jest.fn().mockResolvedValue(mockResume),
  save: jest.fn().mockResolvedValue(mockResume),
};

// Teste do Use Case
const useCase = new CreateResumeUseCase(mockRepository);
const result = await useCase.execute(request);
expect(result).toEqual(expectedResult);
```

## Benefícios

1. **Consistência**: Todos os módulos seguem o mesmo padrão
2. **Desacoplamento**: Fácil trocar implementações
3. **Testabilidade**: Mock de interfaces é simples
4. **Manutenibilidade**: Mudanças isoladas em uma camada
5. **Escalabilidade**: Fácil adicionar novos módulos
6. **SOLID**: Código segue princípios sólidos

## Módulos Atuais

- **AI**: Já segue a arquitetura (exemplo)
- **Resume**: Migrar para estrutura padrão
- **Chat**: Migrar para estrutura padrão
- **User**: Migrar para estrutura padrão
- **Auth**: Migrar para estrutura padrão
- **GeneratedResume**: Migrar para estrutura padrão

## Próximos Passos

1. Criar estrutura padrão em todos os módulos
2. Criar Ports para todos os repositories
3. Criar Use Cases para operações principais
4. Migrar Services para usar Use Cases
5. Adicionar testes unitários
