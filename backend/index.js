import express from 'express';
import cors from 'cors';
import { readUsers, writeUsers, readTasks, writeTasks } from './utils/storage.js';
import { hashPassword, createSession, getSession, deleteSession, authenticate } from './utils/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API Tasky!' });
});

// User registration
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  
  const users = readUsers();
  
  // Check if user already exists
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

// User login
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

// User logout
app.post('/api/auth/logout', authenticate, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  deleteSession(token);
  res.json({ message: 'Logout realizado com sucesso' });
});

// Get all tasks (filtered by user)
app.get('/api/tasks', authenticate, (req, res) => {
  const tasks = readTasks();
  const userTasks = tasks.filter(t => t.userId === req.userId);
  res.json(userTasks);
});

// Get a single task
app.get('/api/tasks/:id', authenticate, (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === parseInt(req.params.id) && t.userId === req.userId);
  
  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  
  res.json(task);
});

// Create a new task
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

// Update a task
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

// Delete a task
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

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
