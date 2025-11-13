# Documentação da Plataforma CI/CD

## Visão Geral

Este documento descreve a plataforma de CI/CD (Integração Contínua e Entrega Contínua) implementada para o projeto Tasky usando GitHub Actions.

## Workflows Implementados

### 1. CI (Integração Contínua) - `.github/workflows/ci.yml`

**Triggers:**
- Push para branches `main` e `develop`
- Pull requests para branches `main` e `develop`

**Jobs:**

#### Backend CI
- **Matriz de Testes**: Node.js 18.x e 20.x
- **Passos:**
  1. Checkout do código
  2. Configuração do Node.js com cache de dependências
  3. Instalação de dependências com `npm ci`
  4. Verificação de sintaxe JavaScript
  5. Execução de testes (quando implementados)

#### Frontend CI
- **Matriz de Testes**: Node.js 18.x e 20.x
- **Passos:**
  1. Checkout do código
  2. Configuração do Node.js com cache de dependências
  3. Instalação de dependências com `npm ci`
  4. Execução do linter (ESLint)
  5. Build da aplicação com Vite
  6. Execução de testes (quando implementados)
  7. Upload dos artefatos de build (apenas Node.js 20.x)

**Benefícios:**
- Detecta problemas de sintaxe antes do merge
- Garante que o código compila em múltiplas versões do Node.js
- Mantém padrões de código através do linting
- Armazena artefatos de build para revisão

---

### 2. CD (Entrega Contínua) - `.github/workflows/cd.yml`

**Triggers:**
- Push para branch `main`
- Tags que começam com `v*` (ex: v1.0.0)
- Execução manual via workflow_dispatch

**Jobs:**

#### Build and Prepare for Deployment
- **Passos:**
  1. Checkout do código
  2. Configuração do Node.js 20.x
  3. Instalação de dependências de produção do backend
  4. Instalação de todas as dependências do frontend
  5. Build do frontend
  6. Criação de pacote de deployment com:
     - Backend completo
     - Frontend compilado
     - README
     - Informações do build
  7. Upload do pacote de deployment (retenção de 30 dias)
  8. Geração de sumário do deployment

#### Docker Build (Opcional)
- Executa apenas em push para `main`
- Configura Docker Buildx
- Gera metadata para imagens Docker
- Constrói imagem Docker (sem push)
- Usa cache do GitHub Actions para builds mais rápidos

**Benefícios:**
- Pacotes de deployment prontos para produção
- Versionamento através de tags Git
- Preparação para containerização com Docker
- Rastreabilidade de builds

---

### 3. Security Checks - `.github/workflows/security.yml`

**Triggers:**
- Push para branches `main` e `develop`
- Pull requests para branches `main` e `develop`
- Agendado diariamente às 00:00 UTC
- Execução manual via workflow_dispatch

**Jobs:**

#### Dependency Review
- Executa apenas em pull requests
- Analisa mudanças em dependências
- Falha em vulnerabilidades de severidade moderada ou superior

#### NPM Audit
- Executa para backend e frontend separadamente
- Gera relatórios JSON de auditoria
- Cria sumário de vulnerabilidades encontradas
- Faz upload dos relatórios de auditoria

#### CodeQL Analysis
- Análise estática de código JavaScript/TypeScript
- Busca por vulnerabilidades de segurança
- Busca por problemas de qualidade
- Integra com GitHub Security tab

**Benefícios:**
- Detecção precoce de vulnerabilidades
- Revisão automática de dependências
- Análise de código para padrões inseguros
- Relatórios de segurança integrados ao GitHub

---

### 4. Code Quality - `.github/workflows/code-quality.yml`

**Triggers:**
- Push para branches `main` e `develop`
- Pull requests para branches `main` e `develop`

**Jobs:**

#### Lint
- Executa linter do frontend
- Verifica sintaxe do backend
- Busca por console.log no código
- Reporta arquivos grandes (>100KB)

#### Format Check
- Verifica line endings (CRLF vs LF)
- Detecta trailing whitespace
- Gera relatórios de formatação

**Benefícios:**
- Mantém consistência de código
- Previne problemas de formatação
- Identifica código de debug deixado acidentalmente
- Monitora crescimento de arquivos

---

### 5. PR Auto Label - `.github/workflows/pr-label.yml`

**Triggers:**
- Pull requests (opened, synchronize, reopened)

**Jobs:**

#### Auto Label PR
- Labels baseados em arquivos alterados (usando `.github/labeler.yml`)
- Labels baseados no tamanho do PR:
  - XS: até 10 linhas
  - S: até 100 linhas
  - M: até 500 linhas
  - L: até 1000 linhas
  - XL: mais de 1000 linhas

**Configuração de Labels (`.github/labeler.yml`):**
- `backend`: Mudanças em arquivos do backend
- `frontend`: Mudanças em arquivos do frontend
- `documentation`: Mudanças em arquivos .md ou docs/
- `dependencies`: Mudanças em package.json ou package-lock.json
- `ci-cd`: Mudanças em workflows do GitHub Actions
- `configuration`: Mudanças em arquivos de configuração

**Benefícios:**
- Organização automática de PRs
- Facilita triagem e revisão
- Identifica PRs grandes que podem precisar ser divididos
- Melhora visibilidade do que cada PR altera

---

## Estrutura de Arquivos

```
.github/
├── workflows/
│   ├── ci.yml              # Integração Contínua
│   ├── cd.yml              # Entrega Contínua
│   ├── security.yml        # Verificações de Segurança
│   ├── code-quality.yml    # Qualidade de Código
│   └── pr-label.yml        # Auto-labeling de PRs
└── labeler.yml             # Configuração de labels automáticos
```

## Requisitos e Permissões

### Permissões Necessárias
- `contents: read` - Ler código do repositório
- `pull-requests: write` - Modificar PRs (para labels)
- `security-events: write` - Escrever eventos de segurança (CodeQL)
- `actions: read` - Ler informações de actions

### Secrets Necessários
- `GITHUB_TOKEN` - Fornecido automaticamente pelo GitHub Actions

## Boas Práticas Implementadas

1. **Caching de Dependências**: Usa cache do Node.js para instalar dependências mais rápido
2. **Matriz de Testes**: Testa em múltiplas versões do Node.js
3. **Artefatos**: Armazena builds e relatórios para análise posterior
4. **Continue on Error**: Alguns checks não bloqueantes usam `continue-on-error`
5. **Sumários**: Gera sumários legíveis no GitHub Actions UI
6. **Segurança em Camadas**: Múltiplos níveis de verificação de segurança
7. **Automação**: Reduz trabalho manual com auto-labeling e checks automáticos

## Monitoramento e Manutenção

### Como Verificar Status
1. Vá para a aba **Actions** do repositório
2. Veja o status de cada workflow
3. Clique em um workflow para ver detalhes
4. Revise logs e artefatos quando necessário

### Badges no README
O README contém badges que mostram o status atual de cada workflow principal:
- CI
- CD
- Security Checks
- Code Quality

### Agendamento
- **Security Checks**: Executa diariamente para detectar novas vulnerabilidades

## Expansão Futura

### Possíveis Melhorias
1. **Testes Unitários**: Adicionar testes e integrar aos workflows
2. **Testes E2E**: Implementar testes end-to-end com Playwright ou Cypress
3. **Deploy Automático**: Configurar deploy para ambientes de staging/produção
4. **Notificações**: Integrar com Slack ou Discord para notificações
5. **Performance Testing**: Adicionar benchmarks de performance
6. **Docker Registry**: Push automático de imagens Docker para registry
7. **Ambiente de Preview**: Criar ambientes temporários para cada PR

## Solução de Problemas

### Workflow Falhando
1. Verifique os logs no GitHub Actions
2. Confirme que todas as dependências estão corretas
3. Teste localmente os comandos que estão falhando
4. Verifique permissões e secrets se necessário

### NPM Audit Reportando Vulnerabilidades
1. Revise o relatório de auditoria nos artefatos
2. Execute `npm audit fix` localmente
3. Atualize dependências manualmente se necessário
4. Documente vulnerabilidades que não podem ser corrigidas imediatamente

### CodeQL False Positives
1. Revise o alerta no GitHub Security tab
2. Se for um falso positivo, marque como tal
3. Adicione comentários explicando a decisão

## Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependency Review](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review)
- [GitHub Security Features](https://docs.github.com/en/code-security)
