from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
import logging

# Configuração de logs para debug
logging.basicConfig(level=logging.DEBUG)

# Inicialização do app Flask
app = Flask(__name__)
CORS(app) # Libera o acesso entre domínios (ex: React + Flask)

# Configuração do banco de dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] ='sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Inicializa o SQLAlchemy com o app
db = SQLAlchemy(app)

# ----------------------- Modelo do Banco de Dados ----------------------- 

# Modelo Categoria ->
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }

# Modelo de Tarefa ->

class Task(db.Model) :
    id = db.Column(db.Integer, primary_key=True)  # ID único da tarefa
    task = db.Column(db.String(200), nullable =False) # Nome da tarefa (obrigatório)
    task_description = db.Column(db.String(500))  # Descrição opcional
    status = db.Column(db.String(20), default='todo')  # Status da tarefa ('todo', 'doing', 'done' etc.)
    tags = db.Column(db.String(200))  # Tags separadas por vírgula
    category_id = db.Column(db.Integer, db.ForeignKey('category.id')) # Relacionamento com Category
    category = db.relationship('Category') # Objeto Category acessível diretamente

    def to_dict(self):
        return{
            'id': self.id,
            'task': self.task,
            'task_description': self.task_description,
            'status': self.status,
            'tags': self.tags.split(',') if self.tags else [],
            'category': self.category.to_dict() if self.category else None
        }

# ----------------------- Rotas da API ----------------------- 


# --------- Rotas da API - Tarefas ---------

# Listar todas as tarefas
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

#Adiciona uma nova tarefa.
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    tags = ",".join(data.get('tags', []))

    # Verifica se foi enviada uma categoria como objeto com id
    category_data = data.get('category')
    category = None
    if isinstance(category_data, dict) and 'id' in category_data:
        category = Category.query.get(category_data['id'])

    # Cria a nova tarefa
    task = Task(
        task=data['task'],
        task_description=data.get('task_description', ''),
        status=data.get('status', 'todo'),
        tags=tags,
        category=category
    )

    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

# Atualizar tarefa existente
@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get_or_404(id)
    data = request.get_json()
    task.task = data.get('task', task.task)
    task.task_description = data.get('task_description', task.task_description)
    task.status = data.get('status', task.status)
    task.tags = ",".join(data.get('tags', task.tags.split(',')))
    
    # Atualiza categoria se enviada
    category_data = data.get('category')
    if isinstance(category_data, dict) and 'id' in category_data:
        task.category = Category.query.get(category_data['id'])

    db.session.commit()
    return jsonify(task.to_dict())

# Deletar tarefa
@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return '', 204


# --------- Rotas da API - Categorias ---------

# Listar todas as categorias
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories])

# Adicionar nova categoria
@app.route('/api/categories', methods=['POST'])
def add_category():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Nome da categoria é obrigatório'}), 400
    
     # Verifica se a categoria já existe
    existing = Category.query.filter_by(name=name).first()
    if existing:
        return jsonify({'error': 'Categoria já existe'}), 400

    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201

# Deletar categoria
@app.route('/api/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return '', 204

# ----------------------- Inicialização ----------------------- 

# Cria as tabelas no banco, se ainda não existirem
with app.app_context():
    db.create_all()

# Inicializa o servidor Flask
if __name__ == '__main__':
    app.run(debug=True, port=8080)
    
    
