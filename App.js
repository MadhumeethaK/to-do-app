import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add this useEffect to handle closing the edit mode when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editId && !e.target.closest('.task-form') && !e.target.closest('button')) {
        setEditId(null);
        setNewTask("");
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId ? { ...task, text: newTask } : task
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTask, completed: false },
      ]);
    }
    setNewTask("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id, text) => {
    setNewTask(text);
    setEditId(id);
  };

  // Add this function to clear all completed tasks
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Add this function to toggle all tasks
  const toggleAllTasks = () => {
    const allCompleted = tasks.every(task => task.completed);
    setTasks(tasks.map(task => ({ ...task, completed: !allCompleted })));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <h1>✅ To-Do App with React Hooks</h1>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <div className="filters">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
      </div>

      {tasks.length > 0 && (
        <div className="task-stats">
          <span>Total: {tasks.length}</span>
          <span>Completed: {tasks.filter(t => t.completed).length}</span>
          <span>Pending: {tasks.filter(t => !t.completed).length}</span>
        </div>
      )}

      <ul className="task-list">
        {filteredTasks.length === 0 && <p>No tasks found.</p>}
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
            <div>
              <button onClick={() => editTask(task.id, task.text)}>✏️</button>
              <button onClick={() => deleteTask(task.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <div className="bulk-actions">
          <button onClick={toggleAllTasks}>
            {tasks.every(t => t.completed) ? "Unmark All" : "Mark All"}
          </button>
          <button onClick={clearCompleted}>Clear Completed</button>
        </div>
      )}
    </div>
  );
}

export default App;
