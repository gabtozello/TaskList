import React, { useState, useEffect } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm.jsx";
import TaskColumn from "./components/TaskColumn.jsx";
import axios from "axios";

//localStorage.removeItem("categorias")

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

// <----------------------CATEGORIAS------------------------------->
// Estado inicial das categorias
// Tenta carregar do localStorage ("categorias") ou começa com um array vazio
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categorias");
    return savedCategories ? JSON.parse(savedCategories) : [];
  });
// useEffect para buscar categorias do backend assim que o componente carregar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Requisição GET para pegar categorias salvas no backend
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );
        const backendCategories = response.data;

        
      // Cria uma cópia das categorias locais
        const merged = [...categories];

        // Verifica se alguma categoria do backend ainda não está no local e adiciona
        backendCategories.forEach((cat) => {
          const exists = merged.some((localCat) => localCat.id === cat.id);
          if (!exists) {
            merged.push(cat);
          }
        });

         // Atualiza o estado e o localStorage com a lista mesclada
        setCategories(merged);
        localStorage.setItem("categorias", JSON.stringify(merged));
      
      } catch (error) {
        console.error("Erro ao buscar categorias do BackEnd:", error);
      }
    };
    // Executa a busca das categorias
    fetchCategories();
  }, []);

// Função para adicionar uma nova categoria (local + backend)
  const handleAddCategory = async () => {
    const input = prompt("Digite o nome da nova categoria:");
    const newCat = input && input.trim();
    // Verifica se já existe uma categoria com o mesmo nome
    if (newCat && !categories.some((cat) => cat.name === newCat)) {
      try {
        // Requisição POST para salvar no backend
        const response = await axios.post(
          "http://127.0.0.1:8080/api/categories",
          {
            name: newCat,
          }
        );

        // Adiciona a nova categoria ao estado e ao localStorage
        const newCategory = response.data;
        const updated = [...categories, newCategory];

        setCategories(updated);
        localStorage.setItem("categorias", JSON.stringify(updated));

        // Se falhar, salva apenas localmente com id 0 (temporário)
      } catch (error) {
        console.error("Erro ao salvar nova categoria no backend:", error);
        const localCategory = { id: 0, name: newCat };
        const updated = [...categories, localCategory];
        setCategories(updated);
        localStorage.setItem("categorias", JSON.stringify(updated));
      }
    }
  };

// Função para remover uma categoria (local + backend)
  const handleRemoveCategory = async (categoryToRemove) => {
    // Confirmação com o usuário
    const confirmRemove = window.confirm(
      `Tem certeza que deseja remover a categoria "${categoryToRemove.name}"?`
    );
    if (!confirmRemove) return;

    try {
        // Se a categoria existir no backend (id diferente de 0), envia DELETE
      if (categoryToRemove.id !== 0) {
        await axios.delete(
          `http://127.0.0.1:8080/api/categories/${categoryToRemove.id}`
        );
      }
      // Remove do estado local e atualiza localStorage
      const updated = categories.filter(
        (cat) => cat.id !== categoryToRemove.id
      );
      setCategories(updated);
      localStorage.setItem("categorias", JSON.stringify(updated));

      // Atualiza tarefas: remove a referência à categoria excluída
      setTasks((prev) =>
        prev.map((task) =>
          task.category?.id === categoryToRemove.id
            ? { ...task, category: null }
            : task
        )
      );
    } catch (error) {
      console.error("Erro ao remover categoria no backend", error);
      alert("Não foi possível remover a categoria. Tente novamente");
    }
  };


  
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
      const updatedTasks = [...prevTasks];
      if (updatedTasks[index].status === "doing") {
        updatedTasks[index].status = "todo";
      } else if (updatedTasks[index].status === "done") {
        updatedTasks[index].status = "doing";
      }
      return updatedTasks;
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
          {categories.map((cat) => (
            <div key={cat.id} className="category_chip">
              <button
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory.id === cat.id ? "ativo" : ""}>
                {cat.name}
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
