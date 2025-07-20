import React, { useState } from "react";
import "./TaskForm.css";
import Tag from "./Tag.jsx";

//useState adiciona as "funçoes"

const TaskForm = ({ setTasks }) => {
  const [taskData, setTaskData] = useState({
    task: "",
    status: "todo",
    tags: [],
  });
  const checkTag = (tag) => {
    return taskData.tags.some((item) => item === tag);
  };
setTasks
  const selectTag = (tag) => {
    //verificando se a tag existe
    if (taskData.tags.some((item) => item === tag)) {
      const filterTags = taskData.tags.filter((item) => item !== tag);
      setTaskData((prev) => {
        return { ...prev, tags: filterTags };
      });
    }else {
      setTaskData((prev) => {
        return { ...prev, tags: [...prev.tags, tag] };
      });
    }
  };
  //esse else altera o valor anterior da tag (possibilitando mudar ou retirar tags)
    //...  é chamado de operador spread (espalhamento) ou rest (resto)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTaskData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  //clicando em submit armazena o objeto
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(taskData);
    setTasks((prev) => {
      return [...prev, taskData];
    });
    setTaskData({
      task: "",
      status: "todo",
      tags: [],
    });
  };
  //tag seletion

  return (
    <header className="app_header">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="task"
          value={taskData.task}
          className="task_input"
          placeholder="Enter your task"
          onChange={handleChange}
        />
        {/**ON CHANGE ACONTECE AQUI OLHA ^ */}
        {/**aqui os botoes de categorias para alterar para dinamico >>>>> */}
        <div className="task_form_bottom_line">
          {/** separando a sessão de tags(categorias) das colunar de listas */}
          <div>
            {/** Usando props, modificamos o nome e o que esta escrito em cada botão
                         * tornando mais dinamico, acredito que aqui que iremos adicionar/remover cada categoria
                         Ex: function define tagName in input for tagname made a new tag
                         TaskForm = Parent
                         Tag = Child
                         */}
            <Tag
              tagName="HTML"
              selectTag={selectTag}
              selected={checkTag("HTML")}
            />
            <Tag
              tagName="React"
              selectTag={selectTag}
              selected={checkTag("React")}
            />
            <Tag
              tagName="Python"
              selectTag={selectTag}
              selected={checkTag("Python")}
            />
          </div>
          <div>
            <select
              name="status"
              value={taskData.status} 
              className="task_status" 
              onChange={handleChange}>
              <option value="todo">To do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>

            <button type="submit" className="task_submit">
              + Add Task
            </button>
          </div>
        </div>
      </form>
    </header>
  );
};

export default TaskForm;
