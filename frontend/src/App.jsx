import { useState, useEffect } from 'react'
import './App.css'
import Auth from './Auth'

const API_URL = 'http://localhost:3001/api/tasks';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    name: '', 
    description: '', 
    deadline: '',
    tags: '' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch tasks when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Erro ao carregar tarefas');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setTasks([]);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.name.trim()) return;

    try {
      // Parse tags from comma-separated string
      const tagsArray = newTask.tags
        ? newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newTask.name,
          description: newTask.description,
          deadline: newTask.deadline || null,
          tags: tagsArray
        }),
      });
      if (!response.ok) throw new Error('Erro ao criar tarefa');
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ name: '', description: '', deadline: '', tags: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok) throw new Error('Erro ao atualizar tarefa');
      const data = await response.json();
      setTasks(tasks.map(task => task.id === id ? data : task));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Erro ao deletar tarefa');
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div>
            <h1>📝 Tasky</h1>
            <p className="subtitle">Gerenciador de Tarefas</p>
          </div>
          <div className="user-info">
            <span>Olá, {user?.username}</span>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </div>
        </div>

        {error && (
          <div className="error">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Nome da tarefa *"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="input"
          />
          <input
            type="date"
            placeholder="Prazo (opcional)"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Tags (separadas por vírgula)"
            value={newTask.tags}
            onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
            className="input"
          />
          <button type="submit" className="btn-add">Adicionar Tarefa</button>
        </form>

        {loading ? (
          <div className="loading">Carregando tarefas...</div>
        ) : (
          <div className="tasks-list">
            {tasks.length === 0 ? (
              <div className="no-tasks">Nenhuma tarefa cadastrada</div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id, task.completed)}
                      className="checkbox"
                    />
                    <div className="task-text">
                      <h3>{task.name}</h3>
                      {task.description && <p className="task-description">{task.description}</p>}
                      <div className="task-meta">
                        {task.deadline && (
                          <span className="task-deadline">
                            📅 {new Date(task.deadline).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="task-tags">
                            {task.tags.map((tag, index) => (
                              <span key={index} className="tag">#{tag}</span>
                            ))}
                          </div>
                        )}
                        <span className="task-created">
                          Criado em: {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <div className="stats">
          Total: {tasks.length} | Concluídas: {tasks.filter(t => t.completed).length}
        </div>
      </div>
    </div>
  )
}

export default App
