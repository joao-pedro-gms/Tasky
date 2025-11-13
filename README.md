# Tasky

[![CI](https://github.com/joao-pedro-gms/Tasky/actions/workflows/ci.yml/badge.svg)](https://github.com/joao-pedro-gms/Tasky/actions/workflows/ci.yml)
[![CD](https://github.com/joao-pedro-gms/Tasky/actions/workflows/cd.yml/badge.svg)](https://github.com/joao-pedro-gms/Tasky/actions/workflows/cd.yml)
[![Security Checks](https://github.com/joao-pedro-gms/Tasky/actions/workflows/security.yml/badge.svg)](https://github.com/joao-pedro-gms/Tasky/actions/workflows/security.yml)
[![Code Quality](https://github.com/joao-pedro-gms/Tasky/actions/workflows/code-quality.yml/badge.svg)](https://github.com/joao-pedro-gms/Tasky/actions/workflows/code-quality.yml)

Aplicação de gerenciamento de tarefas com Node.js (backend) e React (frontend).

## 🚀 Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Estilo**: CSS puro

## 📋 Funcionalidades

- ✅ Criar novas tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Deletar tarefas
- ✅ Visualizar estatísticas das tarefas
- ✅ Interface responsiva com tema claro/escuro

## 🛠️ Instalação e Execução

### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🌐 API Endpoints

- `GET /api/tasks` - Lista todas as tarefas
- `GET /api/tasks/:id` - Busca uma tarefa específica
- `POST /api/tasks` - Cria uma nova tarefa
- `PUT /api/tasks/:id` - Atualiza uma tarefa
- `DELETE /api/tasks/:id` - Deleta uma tarefa

## 📝 Estrutura do Projeto

```
Tasky/
├── backend/           # Servidor Node.js
│   ├── index.js       # Arquivo principal do servidor
│   ├── package.json   # Dependências do backend
│   └── .env.example   # Exemplo de configuração
├── frontend/          # Aplicação React
│   ├── src/           # Código fonte
│   ├── package.json   # Dependências do frontend
│   └── .env.example   # Exemplo de configuração
└── README.md          # Este arquivo
```

## 🎨 Screenshots

A interface permite gerenciar tarefas de forma simples e intuitiva, com suporte a tema claro e escuro automaticamente baseado nas preferências do sistema.

## 📦 Dependências Principais

### Backend
- `express` - Framework web
- `cors` - Middleware para CORS
- `nodemon` - Auto-reload durante desenvolvimento

### Frontend
- `react` - Biblioteca de UI
- `vite` - Build tool e dev server

## 🔄 CI/CD

Este projeto utiliza GitHub Actions para integração e entrega contínua:

### Workflows Disponíveis

- **CI (Integração Contínua)**: Executa testes, linting e build automaticamente em cada push e pull request
  - Backend: Testes de sintaxe em Node.js 18.x e 20.x
  - Frontend: Linting com ESLint e build com Vite em Node.js 18.x e 20.x
  
- **CD (Entrega Contínua)**: Prepara pacotes de deployment quando código é enviado para a branch main
  - Gera artefatos de build otimizados
  - Cria pacote de deployment completo
  - Prepara imagens Docker (opcional)

- **Security Checks**: Verifica vulnerabilidades de segurança
  - NPM Audit para backend e frontend
  - Dependency Review em pull requests
  - CodeQL para análise de código

- **Code Quality**: Verifica qualidade do código
  - Linting
  - Verificação de sintaxe
  - Análise de tamanho de arquivos

- **PR Auto Label**: Adiciona labels automáticos em pull requests
  - Labels baseados em arquivos alterados
  - Labels baseados no tamanho do PR

### Status dos Workflows

Você pode acompanhar o status de todos os workflows na [aba Actions](https://github.com/joao-pedro-gms/Tasky/actions) do repositório.

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

Todos os pull requests passarão por verificações automáticas de CI/CD antes de serem mesclados.

## 📄 Licença

Este projeto está sob a licença ISC.