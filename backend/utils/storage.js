import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Garante que o diretório de dados existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializa os arquivos se eles não existirem
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]', 'utf8');
}

if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, '[]', 'utf8');
}

// Lê usuários do arquivo JSON
export const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Escreve usuários no arquivo JSON
export const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
};

// Lê tarefas do arquivo JSON como hashmap
// Estrutura: { [userId]: { [taskId]: task } }
export const readTasks = () => {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Migra dados antigos (array) para novo formato (hashmap)
    if (Array.isArray(parsed)) {
      const hashmap = {};
      parsed.forEach(task => {
        const userId = task.userId;
        if (!hashmap[userId]) {
          hashmap[userId] = {};
        }
        hashmap[userId][task.id] = task;
      });
      // Salva no novo formato
      writeTasks(hashmap);
      return hashmap;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading tasks:', error);
    return {};
  }
};

// Escreve tarefas no arquivo JSON (hashmap format)
export const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing tasks:', error);
    return false;
  }
};

// Helper: Obtém tarefas de um usuário como array
export const getUserTasks = (userId) => {
  const tasks = readTasks();
  const userTasks = tasks[userId] || {};
  return Object.values(userTasks);
};

// Helper: Obtém uma tarefa específica
export const getTask = (userId, taskId) => {
  const tasks = readTasks();
  return tasks[userId]?.[taskId] || null;
};

// Helper: Adiciona ou atualiza uma tarefa
export const setTask = (userId, task) => {
  const tasks = readTasks();
  if (!tasks[userId]) {
    tasks[userId] = {};
  }
  tasks[userId][task.id] = task;
  return writeTasks(tasks);
};

// Helper: Remove uma tarefa
export const deleteTask = (userId, taskId) => {
  const tasks = readTasks();
  if (tasks[userId] && tasks[userId][taskId]) {
    delete tasks[userId][taskId];
    return writeTasks(tasks);
  }
  return false;
};

// Helper: Gera próximo ID de tarefa
export const getNextTaskId = () => {
  const tasks = readTasks();
  let maxId = 0;
  Object.values(tasks).forEach(userTasks => {
    Object.values(userTasks).forEach(task => {
      if (task.id > maxId) {
        maxId = task.id;
      }
    });
  });
  return maxId + 1;
};
