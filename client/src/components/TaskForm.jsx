import React, { useState } from "react";
import "./TaskForm.css";
import Tag from "./Tag.jsx";
import axios from "axios";
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
    if (name === "category") {
      const selectedCategory = categories.find(cat => cat.id === Number(value))
      setTaskData(prev => ({...prev, category: selectedCategory}));
    } else{
      setTaskData((prev) => ({...prev, [name]: value}));
    }
  };

  // Submete nova tarefa ou atualiza tarefa existente
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (taskData.task.trim() === "") {
        alert("O título da tarefa não pode estar vazio.");
        return;
      }
      try {
        let updatedTasks;

        if (editIndex !== null) {
            const response = await axios.put(`http://localhost:8080/api/tasks/${taskData.id}`, taskData);
            const updatededTasks = response.data;
            
            setTasks((prev) => {
            const updatededList = [...prev];
            updatededList[editIndex] = updatededTasks;
            return updatededList;
          });

          setEditIndex(null);
        } else {
          const response = await axios.post(`http://localhost:8080/api/tasks`, taskData)
          const newTask = response.data;

          setTasks((prev) => {
        const updatedList = [...prev, newTask];
        updatedTasks = updatedList;
        return updatedList;
      });
    }
      // Atualiza o localStorage
      if(updatedTasks) {
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      }

      // Limpa formulário após salvar
      setTaskData({
          task: "",
          task_description: "",
          status: "todo",
          tags: [],
          category: null,
        });
        onCancel(); // Fechar modal
      } catch (error) {
        console.error("Erro ao salvar tarefa", error);
        alert("Erro ao salvar tarefa. Verifique o console")
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
              value={taskData.category?.id || ""}
              className="task_categories"
              onChange={handleChange}>
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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
