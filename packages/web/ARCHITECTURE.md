# Arquitetura Frontend - Coomb Web

Arquitetura pragmática focada em produtividade, manutenibilidade e onboarding rapido, aplicando SOLID e inversao de dependencia de forma pratica.

## Principios

1. **Feature-Based Structure** - Organizacao por features, nao por tipo de **arquivo**
2. **Inversao de Dependencia** - Interfaces simples para abstrair implementacoes
3. **SOLID Aplicado** - Mas de forma pratica, sem over-engineering
4. **Onboarding Rapido** - Estrutura facil de entender e navegar
5. **Performance First** - SSR, code splitting, otimizacoes

## Estrutura de Pastas

```
src/
├── app/                          # Next.js App Router (Features por rota)
│   ├── (public)/                 # Rotas publicas
│   │   ├── page.tsx
│   │   ├── entrar/
│   │   │   ├── page.tsx
│   │   │   ├── _components/      # Componentes especificos desta rota
│   │   │   │   └── login-form.tsx
│   │   │   ├── _hooks/            # Hooks especificos desta rota
│   │   │   │   └── use-login.ts
│   │   │   └── _services/         # Services especificos (se necessario)
│   │   │       └── login.service.ts
│   │   └── cadastrar/
│   │       ├── page.tsx
│   │       └── _components/
│   │
│   ├── (protected)/              # Rotas autenticadas
│   │   ├── layout.tsx            # Auth guard
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── _components/
│   │   │   │   ├── dashboard-header/
│   │   │   │   ├── chat-container/
│   │   │   │   └── chat-input/
│   │   │   ├── _hooks/
│   │   │   │   └── use-dashboard.ts
│   │   │   └── _services/
│   │   │       └── chat.service.ts
│   │   │
│   │   ├── curriculo/
│   │   │   ├── page.tsx
│   │   │   ├── _components/
│   │   │   │   ├── experience-card/
│   │   │   │   │   ├── experience-card.tsx
│   │   │   │   │   └── experience-card.hooks.ts
│   │   │   │   ├── skill-list/
│   │   │   │   └── education-form/
│   │   │   ├── _hooks/
│   │   │   │   ├── use-resume.ts
│   │   │   │   └── use-experiences.ts
│   │   │   └── _services/
│   │   │       └── resume.service.ts
│   │   │
│   │   └── perfil/
│   │       ├── page.tsx
│   │       └── _components/
│   │
│   ├── api/                      # Route Handlers (BFF quando necessario)
│   ├── layout.tsx
│   ├── error.tsx
│   └── loading.tsx
│
├── components/                    # Componentes compartilhados entre rotas
│   ├── ui/                       # Design System (shadcn/ui)
│   │   ├── button/
│   │   ├── input/
│   │   └── card/
│   └── layout/                   # Layouts compartilhados
│       ├── dashboard-layout.tsx
│       └── auth-layout.tsx
│
├── hooks/                         # Hooks compartilhados
│   ├── use-media-query.ts
│   ├── use-debounce.ts
│   └── use-auth.ts               # Hook compartilhado de auth
│
├── services/                      # Services compartilhados
│   ├── api.ts                    # Cliente HTTP configurado
│   ├── auth.service.ts           # Service compartilhado de auth
│   └── resume.service.ts         # Service compartilhado (se usado em varias rotas)
│
├── lib/                           # Utilitarios
│   ├── utils.ts
│   └── format.ts
│
├── types/                         # Tipos globais
│   └── common.types.ts
│
├── constants/
│   └── routes.ts
│
└── providers/                     # Context Providers
    ├── auth.provider.tsx
    ├── theme.provider.tsx
    └── query.provider.tsx
```

### Convencao de Pastas com `_`

- `_components/` - Componentes especificos daquela rota
- `_hooks/` - Hooks especificos daquela rota
- `_services/` - Services especificos (quando nao compartilhados)
- `_types/` - Tipos especificos (quando necessario)

Isso mantem o codigo colocado (proximo da rota que usa) e evita duplicacao de estrutura.

## Padroes de Arquitetura

### 1. Inversao de Dependencia (Interfaces Simples)

Criar interfaces para abstrair implementacoes, mas sem over-engineering:

```typescript
// lib/api.interface.ts
export interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: unknown): Promise<T>;
  patch<T>(url: string, data?: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

// lib/api.ts (Implementacao)
import axios from "axios";
import type { ApiClient } from "./api.interface";

class AxiosApiClient implements ApiClient {
  private client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  // ... outros metodos
}

export const apiClient: ApiClient = new AxiosApiClient();
```

### 2. Services com Interfaces

```typescript
// services/resume.service.interface.ts
export interface ResumeService {
  get(): Promise<Resume>;
  update(data: UpdateResumeData): Promise<Resume>;
  addExperience(data: CreateExperienceData): Promise<Resume>;
}

// services/resume.service.ts (Se usado em varias rotas)
import { apiClient } from "@/lib/api";
import type { ResumeService } from "./resume.service.interface";

export const resumeService: ResumeService = {
  async get() {
    return apiClient.get<Resume>("/api/v1/resume");
  },

  async update(data) {
    return apiClient.patch<Resume>("/api/v1/resume", data);
  },

  // ...
};
```

### 3. Hooks como Camada de Apresentacao

```typescript
// features/resume/hooks/use-resume.ts
import useSWR from "swr";
import { resumeService } from "../services/resume.service";

export function useResume() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/v1/resume",
    () => resumeService.get(),
    {
      revalidateOnFocus: false,
    }
  );

  const updateResume = useCallback(
    async (updates: UpdateResumeData) => {
      const updated = await resumeService.update(updates);
      mutate(updated, false);
      return updated;
    },
    [mutate]
  );

  return {
    resume: data,
    isLoading,
    error,
    updateResume,
    refresh: mutate,
  };
}
```

### 4. Componentes com View Models (Opcional)

Para componentes complexos, extrair logica para hooks:

```typescript
// app/(protected)/curriculo/_components/experience-card/experience-card.hooks.ts
export function useExperienceCard(experienceId: string) {
  const { resume, updateResume } = useResume();
  const experience = resume?.experiences.find((e) => e.id === experienceId);

  const handleDelete = useCallback(async () => {
    if (!resume) return;

    const filtered = resume.experiences.filter((e) => e.id !== experienceId);
    await updateResume({ experiences: filtered });
  }, [resume, experienceId, updateResume]);

  return {
    experience,
    onDelete: handleDelete,
  };
}

// app/(protected)/curriculo/_components/experience-card/experience-card.tsx
("use client");

import { useExperienceCard } from "./experience-card.hooks";
import { Button } from "@/components/ui/button";

export function ExperienceCard({ experienceId }: { experienceId: string }) {
  const { experience, onDelete } = useExperienceCard(experienceId);

  if (!experience) return null;

  return (
    <Card>
      <h3>{experience.position}</h3>
      <p>{experience.company}</p>
      <Button onClick={onDelete}>Remover</Button>
    </Card>
  );
}
```

## Server vs Client Components

### Server Components (Padrao)

```typescript
// app/(protected)/dashboard/page.tsx
import { Suspense } from "react";
import { DashboardHeader } from "./_components/dashboard-header";
import { ChatContainer } from "./_components/chat-container";

export default async function DashboardPage() {
  // Fetch no servidor
  const user = await getUser();

  return (
    <div>
      <DashboardHeader user={user} />
      <Suspense fallback={<ChatSkeleton />}>
        <ChatContainer />
      </Suspense>
    </div>
  );
}
```

### Client Components (Quando Necessario)

```typescript
// app/(protected)/dashboard/_components/chat-container/chat-container.tsx
"use client";

import { useChat } from "../../_hooks/use-chat";

export function ChatContainer() {
  const { messages, sendMessage } = useChat();

  return (
    <div>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
```

## Gerenciamento de Estado

### 1. Server State (SWR)

```typescript
// app/(protected)/curriculo/_hooks/use-resume.ts
import useSWR from "swr";
import { resumeService } from "../_services/resume.service";

export function useResume() {
  return useSWR("/api/v1/resume", resumeService.get);
}
```

### 2. UI State (useState/Zustand)

```typescript
// app/(protected)/dashboard/_stores/chat.store.ts
import { create } from "zustand";

interface ChatStore {
  isSidebarOpen: boolean;
  currentChatId: string | null;
  toggleSidebar: () => void;
  setCurrentChatId: (id: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isSidebarOpen: false,
  currentChatId: null,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setCurrentChatId: (id) => set({ currentChatId: id }),
}));
```

### 3. Form State (React Hook Form)

```typescript
// app/(protected)/curriculo/_components/experience-form/experience-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema } from "./experience-form.schema";

export function ExperienceForm() {
  const form = useForm({
    resolver: zodResolver(experienceSchema),
  });

  // ...
}
```

## Performance

### 1. Code Splitting

```typescript
// Lazy load de componentes pesados
import dynamic from "next/dynamic";

const HeavyEditor = dynamic(() => import("@/components/editor/rich-editor"), {
  loading: () => <Skeleton />,
});
```

### 2. Memoizacao

```typescript
import { memo, useMemo } from "react";

export const ExperienceList = memo(function ExperienceList({
  experiences,
}: Props) {
  const sorted = useMemo(
    () =>
      [...experiences].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ),
    [experiences]
  );

  return (
    <div>
      {sorted.map((exp) => (
        <ExperienceCard key={exp.id} experience={exp} />
      ))}
    </div>
  );
});
```

### 3. Streaming com Suspense

```typescript
// app/(protected)/curriculo/page.tsx
export default function CurriculoPage() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <ExperiencesSection />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <EducationSection />
      </Suspense>
    </div>
  );
}
```

## Tratamento de Erros

### Error Boundaries

```typescript
// app/error.tsx
"use client";

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Algo deu errado</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
```

### Erros em Hooks

```typescript
// app/(protected)/curriculo/_hooks/use-resume.ts
export function useResume() {
  const { data, error } = useSWR("/api/v1/resume", fetcher);

  if (error) {
    // Log error
    console.error("Failed to load resume:", error);
  }

  return { resume: data, error, isLoading: !data && !error };
}
```

## Testes

### Estrutura

```
__tests__/
├── app/
│   ├── (protected)/
│   │   ├── curriculo/
│   │   │   ├── _components/
│   │   │   ├── _hooks/
│   │   │   └── _services/
│   │   └── dashboard/
│   └── (public)/
└── components/
```

### Exemplo

```typescript
// __tests__/app/(protected)/curriculo/_components/experience-card.test.tsx
import { render, screen } from "@testing-library/react";
import { ExperienceCard } from "@/app/(protected)/curriculo/_components/experience-card";

describe("ExperienceCard", () => {
  it("renders experience information", () => {
    render(<ExperienceCard experienceId="1" />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });
});
```

## Convencoes

### Nomenclatura

- **Componentes**: PascalCase (`ExperienceCard`)
- **Hooks**: camelCase com `use` (`useResume`)
- **Services**: camelCase (`resumeService`)
- **Arquivos**: kebab-case (`experience-card.tsx`)
- **Tipos**: PascalCase (`Resume`, `UpdateResumeData`)

### Estrutura de Arquivo

```typescript
// 1. Imports externos
import { useState } from "react";
import useSWR from "swr";

// 2. Imports compartilhados
import { Button } from "@/components/ui/button";

// 3. Imports da rota (colocation)
import { useResume } from "../_hooks/use-resume";

// 4. Tipos
interface Props {
  experienceId: string;
}

// 5. Componente
export function ExperienceCard({ experienceId }: Props) {
  // ...
}
```

## Checklist de Qualidade

- [ ] Componentes pequenos e focados (< 200 linhas)
- [ ] Hooks extraidos para logica complexa
- [ ] Services com interfaces (quando compartilhados)
- [ ] Tipos TypeScript completos
- [ ] Loading states
- [ ] Error states
- [ ] Acessibilidade (a11y)
- [ ] Responsivo
- [ ] Performance otimizada
- [ ] Testes para logica critica

## Quando Colocar Codigo Onde

### Dentro da Rota (`_components/`, `_hooks/`, `_services/`)

- Codigo usado apenas naquela rota
- Componentes especificos da pagina
- Logica de negocio especifica da rota

### Fora da Rota (`components/`, `hooks/`, `services/`)

- Codigo compartilhado entre 2+ rotas
- Componentes UI reutilizaveis
- Services globais (auth, etc)
- Hooks utilitarios

## Onboarding

1. **Estrutura Clara**: App Router ja organiza por features
2. **Colocation**: Codigo proximo da rota que usa
3. **Padroes Consistentes**: Mesma estrutura em todas as rotas
4. **Documentacao**: Comentarios onde necessario
5. **TypeScript**: Tipos claros facilitam entendimento
