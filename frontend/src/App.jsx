import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
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

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error('Erro ao criar tarefa');
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      });
      if (!response.ok) throw new Error('Erro ao deletar tarefa');
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>📝 Tasky</h1>
        <p className="subtitle">Gerenciador de Tarefas</p>

        {error && (
          <div className="error">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Título da tarefa"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
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
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
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
