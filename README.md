# Tasky

Aplicação de gerenciamento de tarefas com Node.js (backend) e React (frontend).

## 🚀 Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Estilo**: CSS puro

## 📋 Funcionalidades

- ✅ Autenticação de usuários (login e cadastro)
- ✅ Criar novas tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Deletar tarefas
- ✅ Visualizar estatísticas das tarefas
- ✅ Interface responsiva com tema claro/escuro
- ✅ Tarefas isoladas por usuário

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
- `POST /api/auth/login` - Faz login de um usuário
- `GET /api/auth/me` - Retorna informações do usuário autenticado

### Tarefas (rotas protegidas)
- `GET /api/tasks` - Lista todas as tarefas do usuário autenticado
- `GET /api/tasks/:id` - Busca uma tarefa específica do usuário
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
- `jsonwebtoken` - Autenticação JWT
- `bcryptjs` - Hash de senhas
- `nodemon` - Auto-reload durante desenvolvimento

### Frontend
- `react` - Biblioteca de UI
- `vite` - Build tool e dev server

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.