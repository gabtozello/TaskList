import React, { useState, useEffect } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm.jsx";
import TaskColumn from "./components/TaskColumn.jsx";

const oldTasks = localStorage.getItem("tasks");
console.log("OLD TASKS", oldTasks);

const App = () => {
  // Estados principais
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskData, setTaskData] = useState({
    task: "",
    task_description: "",
    status: "todo",
    tags: [],
    category: "",
  });

  // Resetar o formulario de tarefas
  const resetTaskForm = () => {
    setTaskData({
      task: "",
      task_description: "",
      status: "todo",
      tags: [],
      category: "",
    });
    setEditIndex(null);
  };

  // Inicializa o estado 'categories' lendo do localStorage para persistência entre sessões
  // Se não encontrar categorias salvas, usa o array padrão como valor inicial
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categorias");
    return savedCategories
      ? JSON.parse(savedCategories)
      : ["Trabalho", "Pessoal", "Estudo"];
  });

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categories));
  }, [categories]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  // Filtro de tarefas para categorias / Pesquisa de tarefas
  const filterTasks = tasks.filter((task) => {
    const name = task.task?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    if (searchLower.length > 0) {
      // Quando tem busca, só filtra pelo texto, independente da categoria
      return name.includes(searchLower);
    }

    // Quando não tem busca, filtra pela categoria (ou "Todas" para tudo)
    const isAllSelected = selectedCategory === "Todas";
    return isAllSelected ? true : task.category === selectedCategory;
  });

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Atualiza localStorage sempre que as tarefas mudam
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Adicionar nova categoria
  const handleAddCategory = () => {
    const newCat = prompt("Digite o nome da nova categoria:");

    if (newCat && !categories.includes(newCat)) {
      setCategories((prev) => [...prev, newCat]);
    }
  };

  // Remover categoria
  const handleRemoveCategory = (cat) => {
    const confirm = window.confirm(
      `Tem certeza que deseja remover a categoria "${cat}"?`
    );

    if (confirm) {
      setCategories((prev) => prev.filter((c) => c !== cat));

      // Remover a categoria excluida das tasks
      setTasks((prev) =>
        prev.map((task) =>
          task.category === cat ? { ...task, category: "" } : task
        )
      );

      // Se a categoria removida estava selecionada, resetar para useState("Todas")
      if (selectedCategory === cat) {
        setSelectedCategory("Todas");
      }
    }
  };

  // Deletar tarefa
  const handleDelete = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // Editar tarefa
  const handleEdit = (index) => {
    console.log(taskData);
    setTaskData(tasks[index]);
    setEditIndex(index);
    setShowForm(true); // Abre o form já preenchido
  };

  // Resetar form para adicionar tarefa
  const handleNewTask = () => {
    if (!showForm) {
      resetTaskForm();
    }
    setShowForm((prev) => !prev);
  };

  // Mover tarefa para o estado anterior
  const handleMoveLeft = (index) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task, i) => {
        if (i !== index) return task;

        if (task.status === "doing") {
          return { ...task, status: "todo" };
        } else if (task.status === "done") {
          return { ...task, status: "doing" };
        } else {
          return task;
        }
      });
    });
  };

  // Mover tarefa para o próximo estado
  const handleMoveRight = (index) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task, i) => {
        if (i !== index) return task;

        if (task.status === "todo") {
          return { ...task, status: "doing" };
        } else if (task.status === "doing") {
          return { ...task, status: "done" };
        } else {
          return task;
        }
      });
    });
  };

  return (
    <div className="app">
      <header className="app_header">📝 Minha Lista de Tarefas</header>

      <div className="task_controls_wrapper">
        <div className="task_controls">
          <div className="search_wrapper">
            <input
              type="text"
              className="search"
              placeholder="Buscar Tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="btn_wrapper">
            <button onClick={handleNewTask} className="task_modal_btn">
              {showForm ? "Fechar Formulário" : "Adicionar Tarefa"}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <TaskForm
          setTasks={setTasks}
          categories={categories}
          taskData={taskData}
          setTaskData={setTaskData}
          editIndex={editIndex}
          setEditIndex={setEditIndex}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="categories_container">
        <div className="categories_btns_wrapper">
          {/* Botão "Todas" */}
          <div className="category_chip">
            <button
              onClick={() => setSelectedCategory("Todas")}
              className={selectedCategory === "Todas" ? "ativo" : ""}>
              Todas
            </button>
          </div>
          {/* Botões de categorias */}
          {categories.map((cat, i) => (
            <div key={i} className="category_chip">
              <button
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "ativo" : ""}>
                {cat}
              </button>
              <button
                onClick={() => handleRemoveCategory(cat)}
                className="remove_category_btn">
                ❌
              </button>
            </div>
          ))}
          {/* Botão para adicionar nova categoria */}
          <button className="category_chip" onClick={handleAddCategory}>
            + Nova Categoria
          </button>
        </div>
      </div>

      <main className="app_main">
        <TaskColumn
          taskColumnName="To Do"
          icon="📌"
          tasks={filterTasks}
          status="todo"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleMoveLeft={handleMoveLeft}
          handleMoveRight={handleMoveRight}
        />
        <TaskColumn
          taskColumnName="Doing"
          icon="🚀"
          tasks={filterTasks}
          status="doing"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleMoveLeft={handleMoveLeft}
          handleMoveRight={handleMoveRight}
        />
        <TaskColumn
          taskColumnName="Done"
          icon="✅"
          tasks={filterTasks}
          status="done"
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleMoveLeft={handleMoveLeft}
          handleMoveRight={handleMoveRight}
        />
      </main>
    </div>
  );
};

export default App;
