import { useState, useEffect, useMemo } from 'react'
import './App.css'
import Auth from './Auth'

const API_URL = 'http://localhost:3001/api/tasks';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  // Tasks stored as hashmap: { [taskId]: task }
  const [tasksMap, setTasksMap] = useState({});
  const [newTask, setNewTask] = useState({ 
    name: '', 
    description: '', 
    deadline: '',
    tags: '' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  // Convert hashmap to array for rendering
  const tasks = useMemo(() => Object.values(tasksMap), [tasksMap]);

  // Verifica por token existente ao montar o componente
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

  // Busca tarefas quando autenticado
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
      // Convert array to hashmap for O(1) lookups
      const hashmap = {};
      data.forEach(task => {
        hashmap[task.id] = task;
      });
      setTasksMap(hashmap);
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
    setTasksMap({});
  };

  // Função para obter sugestões de melhoria usando IA
  const getSuggestions = async () => {
    if (!newTask.name.trim()) {
      setError('Digite um título para obter sugestões');
      return;
    }

    try {
      setLoadingSuggestions(true);
      setError(null);
      const response = await fetch(`${API_URL}/suggest-improvements`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newTask.name,
          description: newTask.description
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao obter sugestões');
      }
      
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Função para aplicar sugestões
  const applySuggestions = () => {
    if (suggestions) {
      setNewTask({
        ...newTask,
        name: suggestions.suggestedTitle,
        description: suggestions.suggestedDescription
      });
      setSuggestions(null);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.name.trim()) return;

    try {
      // Converte tags de string separada por vírgulas para array
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
      // Add task to hashmap using O(1) operation
      setTasksMap(prev => ({ ...prev, [data.id]: data }));
      setNewTask({ name: '', description: '', deadline: '', tags: '' });
      setSuggestions(null);
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
      // Update task in hashmap using O(1) operation
      setTasksMap(prev => ({ ...prev, [id]: data }));
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
      // Remove task from hashmap using destructuring
      setTasksMap(prev => {
        const { [id]: _, ...remaining } = prev;
        return remaining;
      });
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
          <div className="form-actions">
            <button type="submit" className="btn-add">Adicionar Tarefa</button>
            <button 
              type="button" 
              onClick={getSuggestions} 
              className="btn-suggest"
              disabled={loadingSuggestions}
            >
              {loadingSuggestions ? '🤔 Pensando...' : '✨ Sugerir Melhorias (IA)'}
            </button>
          </div>
        </form>

        {/* Painel de sugestões */}
        {suggestions && (
          <div className="suggestions-panel">
            <h3>💡 Sugestões de Melhoria</h3>
            <div className="suggestion-item">
              <strong>Título sugerido:</strong>
              <p>{suggestions.suggestedTitle}</p>
            </div>
            <div className="suggestion-item">
              <strong>Descrição sugerida:</strong>
              <p>{suggestions.suggestedDescription}</p>
            </div>
            <div className="suggestion-item">
              <strong>Melhorias aplicadas:</strong>
              <ul>
                {suggestions.improvements?.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
            <div className="suggestion-actions">
              <button onClick={applySuggestions} className="btn-apply">
                Aplicar Sugestões
              </button>
              <button onClick={() => setSuggestions(null)} className="btn-dismiss">
                Dispensar
              </button>
            </div>
          </div>
        )}

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
