import React, { useState, useEffect } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm.jsx";
import TaskColumn from "./components/TaskColumn.jsx";

const oldTasks = localStorage.getItem("tasks");
console.log("OLD TASKS", oldTasks);

const App = () => {
  const [busca, setBusca] = useState("");
  const [tasks, setTasks] = useState(JSON.parse(oldTasks) || []);
  const [mostrarForm, setMostrarForm] = useState(false);
  {
    /**hook que pode ser usada para integracao de api/localstorage */
  }
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  {
    /**deletando pelo index */
  }
  const handleDelete = (taskIndex) => {
    const newTasks = tasks.filter((task, index) => index !== taskIndex);
    setTasks(newTasks);
  };
  return (
    <div className="app">  
    <header className="app_header">Header Section</header>
      {/*aqui vai o Taskform, em cima de todo o resto (ordem de entrada) */}
      <div className="task_controls">
  <input
    type="text"
    placeholder="Buscar tarefa..."
    value={busca}
    onChange={(e) => setBusca(e.target.value)}
    className="task_search"
  />

  <button
    onClick={() => setMostrarForm((prev) => !prev)}
    className="add_task_btn"
  >
    {mostrarForm ? "Fechar Formulário" : "Adicionar Tarefa"}
  </button>
</div>

      {/* Mostrar o formulário só se mostrarForm for true */}
      {mostrarForm && <TaskForm setTasks={setTasks} />}
    
      <main className="app_main">
        <TaskColumn
          taskColumnName="To Do"
          icon="📌"
          tasks={tasks}
          status="todo"
          handleDelete={handleDelete}
        />
        <TaskColumn
          taskColumnName="Doing"
          icon="🚀"
          tasks={tasks}
          status="doing"
          handleDelete={handleDelete}
        />
        <TaskColumn
          taskColumnName="Done"
          icon="✅"
          tasks={tasks}
          status="done"
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default App;