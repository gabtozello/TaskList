# 📝 Lista de Tarefas React + Flask

Projeto de lista de tarefas fullstack com frontend em React e backend em Flask + SQLAlchemy para persistência em banco de dados.

---

## Funcionalidades

- Frontend React:
  - Criar, editar, deletar tarefas.
  - Filtro por texto e categoria.
  - Movimentação entre status: To do, Doing, Done.
  - Categorias personalizadas.
  - Armazenamento local (localStorage) e backend com banco de dados SQL via Flask

  
- Backend Flask:
  - API REST para persistência das tarefas no banco com SQLAlchemy.
  - Endpoints para CRUD das tarefas.
  - Integração do frontend via chamadas HTTP (fetch/axios).

---

## Tecnologias

- React (Vite) no frontend
- Flask + SQLAlchemy no backend
- SQLite como banco de dados (pode ser outro)
- CSS puro para estilos
- Deploy frontend no Vercel (opcional)

## 📋 Pré-requisitos

- Python 3.x instalado
- Node.js e npm/yarn instalados

## 🔧 Instalação e execução

### 1. Configurar backend (Flask)

1. Abra o terminal na pasta do backend e crie um ambiente virtual:

```bash
python -m venv venv
```

2. Ative o ambiente virtual:

- No Linux/macOS:

```bash
source venv/bin/activate
```
- No Windows (PowerShell):

```bash
venv\Scripts\Activate.ps1
```
3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Execute o servidor Flask:

```bash
python main.py
```


### 2. Configurar frontend (React)

1. No terminal na pasta do frontend, instale as dependências:

```bash
npm install
```

2. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

## ⚙️ Como usar

- Use a interface React para adicionar e gerenciar tarefas.

- As tarefas são salvas localmente e sincronizadas com o backend Flask.

- Navegue entre as colunas To Do, Doing e Done para atualizar o status das tarefas.

- Use filtros de categorias e busca para encontrar tarefas específicas.

## 🌐 Acesso ao Projeto

[![Deploy na Vercel](https://img.shields.io/badge/VERCEL-online-success?style=for-the-badge&logo=vercel)](https://task-list-9a63oho6w-gabtozellos-projects.vercel.app)

