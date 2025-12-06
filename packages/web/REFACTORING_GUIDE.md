# Guia de Refatoracao - Frontend

Este documento explica como aplicar a nova arquitetura de forma gradual, mantendo o codigo existente funcionando.

## Estrategia de Migracao

### Fase 1: Estrutura Base (Ja Feito)

- [x] Criar `shared/lib/api.interface.ts` com interface `ApiClient`
- [x] Refatorar `lib/api.ts` para implementar `ApiClient`
- [x] Manter compatibilidade com codigo existente

### Fase 2: Reorganizar por Features

Mover componentes, hooks e services para estrutura feature-based:

```
features/
├── resume/
│   ├── components/
│   │   ├── experience-card/
│   │   ├── skill-list/
│   │   └── education-form/
│   ├── hooks/
│   │   └── use-resume.ts
│   ├── services/
│   │   └── resume.service.ts
│   └── types/
│       └── resume.types.ts
```

### Fase 3: Adicionar Interfaces aos Services

Criar interfaces para services principais:

```typescript
// features/resume/services/resume.service.interface.ts
export interface ResumeService {
  get(): Promise<Resume>;
  update(data: UpdateResumeData): Promise<Resume>;
}

// features/resume/services/resume.service.ts
import type { ResumeService } from './resume.service.interface';
import { apiClient } from '@/shared/lib/api';

export const resumeService: ResumeService = {
  async get() {
    return apiClient.get<Resume>('/api/v1/resume');
  },
  // ...
};
```

### Fase 4: Extrair Hooks Complexos

Para componentes com muita logica, extrair para hooks:

```typescript
// features/resume/components/experience-card/experience-card.hooks.ts
export function useExperienceCard(experienceId: string) {
  const { resume, updateResume } = useResume();
  
  const handleDelete = useCallback(async () => {
    // logica de delete
  }, []);

  return { experience, handleDelete };
}
```

## Exemplos de Migracao

### Exemplo 1: Service com Interface

**Antes:**
```typescript
// services/resume.service.ts
export const resumeService = {
  async get() {
    const response = await api.get('/api/v1/resume');
    return response.data;
  },
};
```

**Depois:**
```typescript
// features/resume/services/resume.service.interface.ts
export interface ResumeService {
  get(): Promise<Resume>;
}

// features/resume/services/resume.service.ts
import type { ResumeService } from './resume.service.interface';
import { apiClient } from '@/shared/lib/api';

export const resumeService: ResumeService = {
  async get() {
    return apiClient.get<Resume>('/api/v1/resume');
  },
};
```

### Exemplo 2: Componente com Hook Extraido

**Antes:**
```typescript
// components/experience-card.tsx
export function ExperienceCard({ experienceId }) {
  const { resume, updateResume } = useResume();
  const experience = resume?.experiences.find(e => e.id === experienceId);

  const handleDelete = async () => {
    // logica complexa aqui
  };

  return <div>...</div>;
}
```

**Depois:**
```typescript
// features/resume/components/experience-card/experience-card.hooks.ts
export function useExperienceCard(experienceId: string) {
  const { resume, updateResume } = useResume();
  const experience = resume?.experiences.find(e => e.id === experienceId);

  const handleDelete = useCallback(async () => {
    // logica complexa aqui
  }, [resume, experienceId, updateResume]);

  return { experience, handleDelete };
}

// features/resume/components/experience-card/experience-card.tsx
export function ExperienceCard({ experienceId }) {
  const { experience, handleDelete } = useExperienceCard(experienceId);
  return <div>...</div>;
}
```

## Beneficios

1. **Inversao de Dependencia**: Services podem ser mockados facilmente
2. **Testabilidade**: Interfaces facilitam testes
3. **Manutenibilidade**: Codigo organizado por feature
4. **Onboarding Rapido**: Estrutura clara e intuitiva
5. **SOLID**: Aplicado de forma pratica

## Praticas Recomendadas

1. **Interfaces Apenas Quando Necessario**: Nao criar interfaces para tudo
2. **Hooks para Logica Complexa**: Extrair quando componente fica grande
3. **Services com Interfaces**: Para facilitar testes e mocks
4. **Componentes Pequenos**: < 200 linhas
5. **TypeScript Completo**: Sem `any`, tipos claros

