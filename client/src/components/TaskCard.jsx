import React from "react";
import "./TaskCard.css";
import Tag from "./Tag.jsx";

const TaskCard = ({title, tags, handleDelete, index}) => {
  return (
    <article className="task_card">
      <p className="task_text">{title}</p>
      {console.log("o que vem aqui",title)}
      <div className="task_card_bottom_line">
        <div className="task_card_tags">
          {tags.map((tag, index) => ( 
            <Tag key={index}
            tagName={tag} 
            selected />))}
        </div>
        <div className="task_delete" onClick={() => handleDelete(index)}>
          <span className="task_delete_icon">🗑️</span>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
