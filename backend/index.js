import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for tasks
let tasks = [
  { id: 1, title: 'Exemplo de tarefa', description: 'Esta é uma tarefa de exemplo', completed: false },
  { id: 2, title: 'Aprender Node.js', description: 'Estudar desenvolvimento backend', completed: false },
];

let nextId = 3;

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API Tasky!' });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Get a single task
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  res.json(task);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'O título é obrigatório' });
  }
  
  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    completed: false,
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  
  const { title, description, completed } = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
  };
  
  res.json(tasks[taskIndex]);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
