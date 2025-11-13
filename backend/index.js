import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readUsers, writeUsers, readTasks, writeTasks } from './utils/storage.js';
import { hashPassword, createSession, getSession, deleteSession, authenticate } from './utils/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Inicializa o cliente Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API Tasky!' });
});

// Registro de usuário
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  
  const users = readUsers();
  
  // Verifica se o usuário já existe
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Usuário já existe' });
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  writeUsers(users);
  
  const token = createSession(newUser.id);
  
  res.status(201).json({ 
    message: 'Usuário criado com sucesso',
    token,
    user: { id: newUser.id, username: newUser.username }
  });
});

// Login de usuário
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === hashPassword(password));
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  
  const token = createSession(user.id);
  
  res.json({ 
    message: 'Login realizado com sucesso',
    token,
    user: { id: user.id, username: user.username }
  });
});

// Logout de usuário
app.post('/api/auth/logout', authenticate, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  deleteSession(token);
  res.json({ message: 'Logout realizado com sucesso' });
});

// Busca todas as tarefas (filtradas por usuário)
app.get('/api/tasks', authenticate, (req, res) => {
  const tasks = readTasks();
  const userTasks = tasks.filter(t => t.userId === req.userId);
  res.json(userTasks);
});

// Busca uma tarefa específica
app.get('/api/tasks/:id', authenticate, (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === parseInt(req.params.id) && t.userId === req.userId);
  
  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  
  res.json(task);
});

// Cria uma nova tarefa
app.post('/api/tasks', authenticate, (req, res) => {
  const { name, description, deadline, tags } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'O nome é obrigatório' });
  }
  
  const tasks = readTasks();
  
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    name,
    description: description || '',
    createdAt: new Date().toISOString(),
    deadline: deadline || null,
    tags: tags || [],
    userId: req.userId,
    completed: false,
  };
  
  tasks.push(newTask);
  writeTasks(tasks);
  
  res.status(201).json(newTask);
});

// Atualiza uma tarefa
app.put('/api/tasks/:id', authenticate, (req, res) => {
  const taskId = parseInt(req.params.id);
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.userId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  
  const { name, description, deadline, tags, completed } = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    name: name !== undefined ? name : tasks[taskIndex].name,
    description: description !== undefined ? description : tasks[taskIndex].description,
    deadline: deadline !== undefined ? deadline : tasks[taskIndex].deadline,
    tags: tags !== undefined ? tags : tasks[taskIndex].tags,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
  };
  
  writeTasks(tasks);
  
  res.json(tasks[taskIndex]);
});

// Deleta uma tarefa
app.delete('/api/tasks/:id', authenticate, (req, res) => {
  const taskId = parseInt(req.params.id);
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.userId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  
  tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  
  res.status(204).send();
});

// Endpoint para sugestões de melhoria de título e descrição usando Gemini AI
app.post('/api/tasks/suggest-improvements', authenticate, async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'O nome da tarefa é obrigatório' });
  }
  
  // Verifica se a API Key do Gemini está configurada
  if (!genAI) {
    return res.status(503).json({ 
      error: 'Serviço de sugestões não disponível. Configure GEMINI_API_KEY no arquivo .env' 
    });
  }
  
  try {
    // Obtém o modelo Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Cria o prompt para o Gemini
    const prompt = `Você é um assistente especializado em gerenciamento de tarefas. 
Analise o seguinte título e descrição de uma tarefa e sugira melhorias para torná-los mais claros, objetivos e acionáveis.

Título atual: "${name}"
Descrição atual: "${description || 'Sem descrição'}"

Forneça sua resposta APENAS no seguinte formato JSON, sem nenhum texto adicional antes ou depois:
{
  "suggestedTitle": "título melhorado aqui",
  "suggestedDescription": "descrição melhorada aqui",
  "improvements": ["melhoria 1", "melhoria 2", "melhoria 3"]
}

As melhorias devem ser específicas e explicar o que foi alterado e por quê.`;
    
    // Gera o conteúdo usando o Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Tenta fazer parse da resposta JSON
    let suggestions;
    try {
      // Remove possíveis marcadores de código markdown
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta do Gemini:', parseError);
      console.error('Resposta recebida:', text);
      return res.status(500).json({ 
        error: 'Erro ao processar sugestões da IA',
        details: 'Não foi possível interpretar a resposta'
      });
    }
    
    res.json(suggestions);
  } catch (error) {
    console.error('Erro ao gerar sugestões:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar sugestões',
      details: error.message 
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
