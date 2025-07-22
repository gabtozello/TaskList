from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 


import logging
logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] ='sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo Task ->

class Task(db.Model) :
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(200), nullable =False)
    task_description = db.Column(db.String(500))
    status = db.Column(db.String(20), default='todo')
    tags = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship('Category')

    
    def to_dict(self):
        return{
            'id': self.id,
            'task': self.task,
            'task_description': self.task_description,
            'status': self.status,
            'tags': self.tags.split(',') if self.tags else [],
            'category': self.category.to_dict() if self.category else None
        }

# Modelo Categorias ->
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }



# Rotas para Tarefas

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    tags = ",".join(data.get('tags', []))

    # Pega a categoria se for enviada como um dicionário com id
    category_data = data.get('category')
    category = None

    if isinstance(category_data, dict) and 'id' in category_data:
        category = Category.query.get(category_data['id'])

    # Agora sim cria a tarefa com a categoria já tratada
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


@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get_or_404(id)
    data = request.get_json()
    task.task = data.get('task', task.task)
    task.task_description = data.get('task_description', task.task_description)
    task.status = data.get('status', task.status)
    task.tags = ",".join(data.get('tags', task.tags.split(',')))
    category_data = data.get('category')
    if isinstance(category_data, dict) and 'id' in category_data:
        task.category = Category.query.get(category_data['id'])

    db.session.commit()
    return jsonify(task.to_dict())



@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return '', 204

# Rotas para categorias
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories])

@app.route('/api/categories', methods=['POST'])
def add_category():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Nome da categoria é obrigatório'}), 400
    # Verificar se já existe a categoria
    existing = Category.query.filter_by(name=name).first()
    if existing:
        return jsonify({'error': 'Categoria já existe'}), 400

    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

@app.route('/api/categories/<int:id>', methods=['PUT'])
def update_category(id):
    category = Category.query.get_or_404(id)
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Nome da categoria é obrigatório'}), 400
    category.name = name
    db.session.commit()
    return jsonify(category.to_dict())

@app.route('/api/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return '', 204

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=8080)