# CI/CD - Coomb

## Workflows

### CI (Continuous Integration)

**Arquivo**: `.github/workflows/ci.yml`

**Trigger**: Push e Pull Requests para `main` e `develop`

**Jobs**:

1. **api** - Testa e builda o backend NestJS
2. **web** - Testa e builda o frontend Next.js
3. **ai** - Testa e builda o serviço Python
4. **lint** - Verifica formatação
5. **build-status** - Status final

**O que faz**:

- Instala dependências
- Roda linters
- Executa testes
- Gera builds
- Upload de coverage (Codecov)

### CD (Continuous Deployment)

**Arquivo**: `.github/workflows/cd.yml`

**Trigger**: Push para `main` ou manual (`workflow_dispatch`)

**Jobs**:

1. **build-and-push** - Builda e faz push das imagens Docker
2. **deploy** - Deploy para produção (AWS)

**O que faz**:

- Builda imagens Docker para cada serviço
- Faz push para GitHub Container Registry
- Deploy para AWS (Terraform)

## Como usar

### Executar CI localmente

```bash
# Usando act (https://github.com/nektos/act)
act -j api
act -j web
act -j ai
```

### Verificar status

Acesse: `https://github.com/[seu-usuario]/coomb/actions`

## Configuração

### Secrets necessários (GitHub)

- `GITHUB_TOKEN` - Automático (para push de imagens)
- `AWS_ACCESS_KEY_ID` - Para deploy (se necessário)
- `AWS_SECRET_ACCESS_KEY` - Para deploy (se necessário)

### Variáveis de ambiente

Configuradas no workflow:

- `NODE_VERSION: '18'`
- `PYTHON_VERSION: '3.11'`

## Coverage

Coverage é enviado para Codecov (opcional):

- API: `packages/api/coverage/coverage-final.json`
- AI: `packages/ai/coverage.xml`
