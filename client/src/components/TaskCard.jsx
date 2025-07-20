import React from "react";
import "./TaskCard.css";
import Tag from "./Tag.jsx";

const TaskCard = () => {
  return (
    <article className="task_card">
      <p className="task_text">sjdhad</p>
      <div className="task_card_bottom_line">
        <div className="task_card_tags">
          <Tag tagName="HTML" />
          <Tag tagName="React" />
          <Tag tagName="CSS" />
        </div>
        <div className="task_delete">
          <span className="task_delete_icon">🗑️</span>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
