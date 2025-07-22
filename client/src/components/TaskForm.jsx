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
   const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
       ...prev, 
       [name]: value,
    }));
  };

  // Submete nova tarefa ou atualiza tarefa existente
    const handleSubmit = (e) => {
      e.preventDefault();
      if (taskData.task.trim() === "") {
        alert("O título da tarefa não pode estar vazio.");
        return;
      }
      if (editIndex !== null) {
        setTasks((prev) => {
          const updatededTasks = [...prev];
          updatededTasks[editIndex] = taskData;
          return updatededTasks;
        });
        setEditIndex(null);
      } else {
        setTasks((prev) => [...prev, taskData]);
      }

    // Limpa formulário após salvar
      setTaskData({
          task: "",
          task_description: "",
          status: "todo",
          tags: [],
          category: "",
        });
      onCancel(); // Fechar modal
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
          placeholder=""
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
