import React, { useState } from "react";
import "./TaskForm.css";
import Tag from "./Tag.jsx";

//useState adiciona as "funçoes"

const TaskForm = ({
  setTasks,
  categories,
  taskData,
  setTaskData,
  editIndex,
  setEditIndex,
  onCancel,
}) => {
  // Verifica se a tag está selecionada
  const isTagSelected = (tag) => taskData.tags.includes(tag)

  // Adiciona ou remove a tag
  const toggleTag = (tag) => {
    setTaskData((prev) => { 
      const tags = Array.isArray(prev.tags) ? prev.tags : [];
      return {
      ...prev,
      tags: tags.includes(tag) 
      ? tags.filter((t) => t !== tag)
      : [...tags, tag],
    };
    });
  }

  // Atualiza qualquer campo do formulário
   const handleChange =  (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
       ...prev, 
       [name]: value,
    }));
  };

  // Submete nova tarefa ou atualiza tarefa existente
const handleSubmit = async (e) => {
  e.preventDefault();
  try{
    let response;

    if(editIndex !== null && taskData.id) {
      // EDITAR TAREFA EXISTENTE
        response = await fetch(`http://localhost:8080/api/tasks/${taskData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
    
    if (!response.ok) {
      throw new Error("Erro ao atualizar tarefa do backend");
    }

    const updatedTasks = await response.json();

    setTasks((prev) => {
      const updated = [...prev];
      updated[editIndex] = updatedTasks;
      return updated
    });

    setEditIndex(null);
  } else {
    // ADICIONAR TAREFA
    response = await fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error("Erro ao adicionar tarefa no backend");
    }
    
    const newTask = await response.json();
    setTasks((prev) => [...prev, newTask]);
  }
  // Resetar e fechar o modal
  setTaskData ({
      task: "",
      task_description: "",
      status: "todo",
      tags: [],
      category: null,
  });
  setShowForm(false); } catch(error){
   console.error("Erro no handleSubmit:", error);
    alert("Ocorreu um erro ao salvar a tarefa.");
  }
};


  return (
    <header className="app_header">
      <form onSubmit={handleSubmit}>
        {/** Título da tarefa */}
        <input
          type="text"
          name="task"
          value={taskData.task}
          className="task_input"
          placeholder="Digite o título da tarefa..."
          onChange={handleChange}
        />

        {/** Descrição da tarefa */}
        <input
          type="text"
          name="task_description"
          value={taskData.task_description}
          className="task_input"
          placeholder="Digite a descrição"
          onChange={handleChange}
        />
        
        <div className="task_form_bottom_line">

        {/** Tags existentes */}
          <div className="tag_container">
            {["Importante", "Prioridade", "Urgente"].map((tag, index) => (
            <Tag
              key={index}
              tagName={tag}
              selectTag={toggleTag}
              selected={isTagSelected(tag)}
            />
            ))}
          </div>

          <div className="select_actions_container">
            {/** Categorias */}
            <select
              name="category"
              value={taskData.category}
              className="task_categories"
              onChange={handleChange}>
              <option value="">Selecione uma categoria</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {/** Status */}
            <select
              name="status"
              value={taskData.status}
              className="task_status"
              onChange={handleChange}>
              <option value="todo">To do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            {/** Botões Salvar e Cancelar */}
            <button type="submit" className="task_submit">
              {editIndex !== null ? "Salvar" : "+ Adicionar Tarefa"}
            </button>
            <button type="button" className="task_cancel" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </header>
  );
};

export default TaskForm;
