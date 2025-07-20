import React, {useState} from "react";
import './TaskForm.css';
import Tag from "./Tag.jsx";

//useState adiciona as "funçoes" 

const TaskForm = () => {
    const [taskData, setTaskData] = useState ({
        task:"",
        status:"todo"
    });
    const handleChange = (e) => {
        const {name,value} = e.target;

        setTaskData( prev => {
            return {...prev, [name]: value}
        })
    }
    console.log(taskData)
    //const [task, setTask] = useState("");
    //const [status, setStatus] = useState("todo");
    //const handleTaskChange = e => {
    //    setTask(e.target.value);
    //}
    //const handleStatusChange = e => {
    //    setStatus(e.target.value);
    //}
    //console.log(task, status);
    return (
        <header className="app_header">
            <form>
                <input type="text" 
                name="task"
                className="task_input"
                placeholder="Enter your task" 
                onChange={handleChange}/>
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
                        <Tag  tagName ="HTML"/>
                        <Tag tagName ="React"/>
                        <Tag tagName="Python"/>
                    </div>
                    <div>
                        <select name="status" className="task_status" onChange={handleChange}>
                            <option value="todo">To Do</option>
                            <option value="doing">Doing</option>
                            <option value="done">Done</option>
                        </select>
                        <button type='submit' className="task_submit">
                            + Add Task
                        </button>
                    </div>
                </div>
            </form>
        </header>


    );

};

export default TaskForm