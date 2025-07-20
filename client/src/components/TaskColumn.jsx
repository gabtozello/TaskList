import React from "react";
import "./TaskColumn.css";
import TaskCard from "./TaskCard.jsx";

const TaskColumn = (props) => {
    return (
        <section className="task_column">
        <h2 className="task_column_header">
        <span className= "task_column_icon" alt="">{props.icon}</span>
        {props.taskColumnName} 
        </h2>    
        <TaskCard />
        </section>
     )
};

export default TaskColumn