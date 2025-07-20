import React from "react";
import "./App.css";
import TaskForm from "./components/TaskForm.jsx";
import TaskColumn from "./components/TaskColumn.jsx";

const App = () => {
  return (
    <div className="app">
      {/*aqui vai o Taskform, em cima de todo o resto (ordem de entrada) */}
      <TaskForm />
      <header className="app_header">Header Section</header>
      <main className="app_main">
        <TaskColumn taskColumnName="To Do" icon="📌"/>
        <TaskColumn taskColumnName="Doing" icon="🚀"/>
        <TaskColumn taskColumnName="Done" icon="✅"/>
      </main>
    </div>


  )

}

export default App