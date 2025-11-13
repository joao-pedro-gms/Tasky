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

- ✅ Autenticação de usuários (registro e login)
- ✅ Criar novas tarefas com nome, descrição, prazo e tags
- ✅ Marcar tarefas como concluídas
- ✅ Deletar tarefas
- ✅ Visualizar estatísticas das tarefas
- ✅ Tarefas isoladas por usuário (cada usuário vê apenas suas próprias tarefas)
- ✅ Armazenamento persistente em JSON local
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

### Autenticação
- `POST /api/auth/register` - Registra um novo usuário
- `POST /api/auth/login` - Faz login e retorna token de autenticação
- `POST /api/auth/logout` - Faz logout e invalida o token

### Tarefas (requer autenticação)
- `GET /api/tasks` - Lista todas as tarefas do usuário autenticado
- `GET /api/tasks/:id` - Busca uma tarefa específica do usuário
- `POST /api/tasks` - Cria uma nova tarefa
- `PUT /api/tasks/:id` - Atualiza uma tarefa do usuário
- `DELETE /api/tasks/:id` - Deleta uma tarefa do usuário

Para mais detalhes e exemplos, veja [API_EXAMPLES.md](backend/API_EXAMPLES.md)

## 📝 Estrutura do Projeto

```
Tasky/
├── backend/           # Servidor Node.js
│   ├── data/          # Arquivos JSON para armazenamento (gitignored)
│   │   ├── users.json # Credenciais dos usuários
│   │   └── tasks.json # Tarefas dos usuários
│   ├── utils/         # Utilitários
│   │   ├── storage.js # Funções de leitura/escrita JSON
│   │   └── auth.js    # Autenticação e gerenciamento de sessão
│   ├── index.js       # Arquivo principal do servidor
│   ├── package.json   # Dependências do backend
│   ├── SECURITY.md    # Considerações de segurança
│   └── API_EXAMPLES.md # Exemplos de uso da API
├── frontend/          # Aplicação React
│   ├── src/           # Código fonte
│   │   ├── App.jsx    # Componente principal com gerenciamento de tarefas
│   │   ├── Auth.jsx   # Componente de login/registro
│   │   └── ...        # Outros componentes
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

## 📊 Modelo de Dados

### Usuário (User)
```json
{
  "id": 1,
  "username": "user123",
  "password": "hash_da_senha",
  "createdAt": "2025-11-13T12:00:00.000Z"
}
```

### Tarefa (Task)
```json
{
  "id": 1,
  "name": "Nome da tarefa",
  "description": "Descrição detalhada",
  "createdAt": "2025-11-13T12:00:00.000Z",
  "deadline": "2025-12-31",
  "tags": ["tag1", "tag2"],
  "userId": 1,
  "completed": false
}
```

**Campos:**
- `name` (string, obrigatório): Nome da tarefa
- `description` (string, opcional): Descrição detalhada
- `createdAt` (string, automático): Data/hora de criação (ISO 8601)
- `deadline` (string, opcional): Prazo para conclusão (formato: YYYY-MM-DD)
- `tags` (array, opcional): Array de tags para categorização
- `userId` (number, automático): ID do usuário que criou a tarefa
- `completed` (boolean, padrão: false): Status de conclusão

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

## 🔒 Segurança

⚠️ **Importante**: Esta aplicação usa SHA-256 para hash de senhas, que é adequado apenas para fins de demonstração e desenvolvimento local. Para ambientes de produção, consulte [SECURITY.md](backend/SECURITY.md) para recomendações de segurança, incluindo:

- Uso de bcrypt, argon2 ou scrypt para hashing de senhas
- Implementação de gerenciamento de sessão com Redis
- Configuração adequada de CORS e HTTPS
- Rate limiting e validação de entrada
- Proteção contra ataques comuns

## 📄 Licença

Este projeto está sob a licença ISC.