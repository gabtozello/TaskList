import React from "react";
import "./TaskCard.css";
import Tag from "./Tag.jsx";

const TaskCard = ({
  title, 
  description, 
  tags, 
  handleDelete, 
  category,
  index,
  handleEdit,
  status,
  handleMoveLeft,
  handleMoveRight
}) => {
  const statusOrder = ["todo", "doing", "done"];
  const currentStatusIndex = statusOrder.indexOf(status);

  return (
    <article className="task_card">

      <p className="task_text">{title}</p>
      <p className="task_description">{description}</p>
      <p className="task_category">{category?.name || ""}</p> {/* Mostra a categoria */}
      <div className="task_card_bottom_line">
        <div className="task_card_tags">
          {tags.map((tag, index) => ( 
            <Tag key={index}
            tagName={tag} 
            selected />))}
        </div>
       <div className="task_card_actions">
        {/* Botão mover para status anterior*/}
         {currentStatusIndex > 0 && (
            <button onClick={() => handleMoveLeft(index)} title="Mover para o status anterior">⬅️</button>
          )}

           {/* Botão mover para próximo status (esconde se estiver no último) */}
          {currentStatusIndex < statusOrder.length - 1 && (
            <button onClick={() => handleMoveRight(index)} title="Mover para o próximo status">➡️</button>
          )}
          {/* Editar */}
          <button onClick={() => handleEdit(index)} title="Editar">✏️</button>

          {/* Deletar */}
          <button
            className="task_delete_icon"
            onClick={() => handleDelete(index)}
            title="Deletar"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
