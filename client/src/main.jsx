import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App.jsx';
//import Card from "./components/Card.jsx";
//import CreateTodo from './components/CreateTodo.jsx';
import './index.css'

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);