import React from "react";
import "./TaskColumn.css";
import TaskCard from "./TaskCard.jsx";

/**
 * Componente de coluna que agrupa tarefas por status (To do, Doing, Done)
 *
 * Props:
 * - taskColumnName: string do nome da coluna (ex: "To Do")
 * - icon: ícone representando a coluna
 * - tasks: array de todas as tarefas
 * - status: status correspondente às tarefas da coluna
 * - handleEdit: função para editar uma tarefa
 * - handleDelete: função para deletar uma tarefa
 */

const TaskColumn = ({
  taskColumnName,
  icon,
  tasks,
  status,
  handleEdit,
  handleDelete,
  handleMoveLeft,
  handleMoveRight,
}) => {
  return (
    <section className="task_column">
      <h2 className="task_column_header">
        <span className="task_column_icon" alt="">
          {icon}
        </span>
        {taskColumnName}
      </h2>
      {/** Filtrando tarefas pelo status correspondente e renderizando os cards */}
      {tasks.map((task, index) => {
        if (task && task.status === status) {
          return (
            <TaskCard
              key={index}
              index={index} // índice correto do array completo
              title={task.task}
              description={task.task_description}
              category={task.category}
              tags={task.tags}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              status={task.status}
              handleMoveLeft={handleMoveLeft}
              handleMoveRight={handleMoveRight}
            />
          );
        }
        return null;
      })}
    </section>
  );
};

export default TaskColumn;