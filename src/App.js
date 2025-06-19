import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTasks([
      ...tasks,
      { text: input, completed: false, dueDate: dueDate || null }
    ]);
    setInput('');
    setDueDate('');
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleToggleComplete = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
    setEditDueDate(tasks[index].dueDate || '');
  };

  const handleSaveEdit = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editText, dueDate: editDueDate || null } : task
    );
    setTasks(newTasks);
    setEditIndex(null);
    setEditText('');
    setEditDueDate('');
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const tasksLeft = tasks.filter(task => !task.completed).length;

  return (
    <div className={`App${darkMode ? ' dark' : ''}`}>
      <h1>To-Do List</h1>
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        style={{ marginBottom: 16, background: darkMode ? '#222' : '#eee', color: darkMode ? '#fff' : '#222' }}
      >
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <form onSubmit={handleAddTask} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ fontSize: '1.1rem', padding: '10px', borderRadius: '8px', border: '1px solid #b0b0b0' }}
        />
        <button type="submit">Add</button>
      </form>
      <div style={{ marginBottom: 16, fontSize: '1.2rem' }}>Tasks left: {tasksLeft}</div>
      <button onClick={handleClearCompleted} style={{ marginBottom: 24, background: '#e74c3c' }}>Clear Completed</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''}>
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ fontSize: '1.1rem', padding: '8px', borderRadius: '8px', border: '1px solid #b0b0b0' }}
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  style={{ fontSize: '1.1rem', padding: '8px', borderRadius: '8px', border: '1px solid #b0b0b0', marginLeft: 8 }}
                />
                <button onClick={() => handleSaveEdit(index)} style={{ background: '#27ae60' }}>Save</button>
                <button onClick={() => setEditIndex(null)} style={{ background: '#b0b0b0' }}>Cancel</button>
              </>
            ) : (
              <>
                <span>
                  {task.text}
                  {task.dueDate && (
                    <span style={{ fontSize: '1rem', color: '#888', marginLeft: 12 }}>
                      (Due: {task.dueDate})
                    </span>
                  )}
                </span>
                <div>
                  <button onClick={() => handleToggleComplete(index)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => handleEditTask(index)} style={{ background: '#f1c40f' }}>Edit</button>
                  <button onClick={() => handleDeleteTask(index)} style={{ background: '#e74c3c' }}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
