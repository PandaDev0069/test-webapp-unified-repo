from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, Task  , Note, Expense
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)

# Login and register Section

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])

    user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully!"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid credentials!"}), 401
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "message": "Login Successful!"})


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Calculate user level based on XP
    level = user.xp // 100  
    xp_to_next_level = 100 - (user.xp % 100)

    return jsonify({
        "username": user.username,
        "email": user.email,
        "xp": user.xp,
        "level": level,
        "xp_to_next_level": xp_to_next_level,
        "streaks": 5  # Placeholder (replace with streak logic)
    })


# Tasks Section

@api.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()

    if "title" not in data or "due_date" not in data:
        return jsonify({"message": "Title and due date are required"}), 400

    new_task = Task(
        title=data["title"],
        due_date=datetime.strptime(data["due_date"], "%Y-%m-%d %H:%M:%S"),
        user_id=user_id
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({"message": "Task created successfully!", "task": {
        "id": new_task.id,
        "title": new_task.title,
        "due_date": new_task.due_date.strftime("%Y-%m-%d %H:%M:%S"),
        "completed": new_task.completed
    }}), 201



@api.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()

    print(f"Fetched Tasks: {tasks}")

    try:
        task_list = [{
            "id": task.id,
            "title": task.title,
            "completed": task.completed,
            "due_date": task.due_date.strftime("%Y-%m-%d %H:%M:%S") if task.due_date else "N/A"
        } for task in tasks]


        print("Tasks Response:", task_list)
        return jsonify(task_list), 200

    except Exception:
        return jsonify({"msg": "Something went wrong" }), 422



@api.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({"message": "Task not found!"}), 404

    if task.completed:
        return jsonify({"message": "Task already completed!"}), 400

    # Mark the task as completed
    task.completed = True

    # Increase user's XP by 10
    user = User.query.get(user_id)
    user.xp += 10

    db.session.commit()

    return jsonify({
        "message": "Task completed!",
        "new_xp": user.xp
    })


# Delete tasks
@api.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({"message": "Task not found!"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully!"})



# Notes Section
@api.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    user_id = get_jwt_identity()
    data = request.get_json()

    if "title" not in data or "content" not in data:
        return jsonify({"message": "Title and content are required"}), 400

    new_note = Note(title=data["title"], content=data["content"], user_id=user_id)
    db.session.add(new_note)
    db.session.commit()

    return jsonify({"message": "Note created successfully!", "note": {
        "id": new_note.id,
        "title": new_note.title,
        "content": new_note.content
    }}), 201


@api.route('/notes', methods=['GET'])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()
    notes = Note.query.filter_by(user_id=user_id).all()

    return jsonify([{
        "id": n.id,
        "title": n.title,
        "content": n.content
    } for n in notes])


@api.route('/notes/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()

    if not note:
        return jsonify({"message": "Note not found!"}), 404

    data = request.get_json()
    note.title = data.get("title", note.title)
    note.content = data.get("content", note.content)

    db.session.commit()

    return jsonify({"message": "Note updated successfully!", "note": {
        "id": note.id,
        "title": note.title,
        "content": note.content
    }})


@api.route('/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()

    if not note:
        return jsonify({"message": "Note not found!"}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({"message": "Note deleted successfully!"})



# Expenses Section

@api.route('/expenses', methods=['POST'])
@jwt_required()
def add_expense():
    user_id = get_jwt_identity()
    data = request.get_json()

    if "amount" not in data or "category" not in data:
        return jsonify({"message": "Amount and category are required"}), 400

    new_expense = Expense(
        amount=data["amount"],
        category=data["category"],
        date=datetime.strptime(data["date"], "%Y-%m-%d"),
        user_id=user_id
    )

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"message": "Expense added successfully!"}), 201


@api.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(user_id=user_id).all()

    return jsonify([{
        "id": e.id,
        "amount": e.amount,
        "category": e.category,
        "date": e.date.strftime("%Y-%m-%d")
    } for e in expenses])


@api.route('/expenses/<int:expense_id>', methods=['GET'])
@jwt_required()
def get_expense(expense_id):
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()

    if not expense:
        return jsonify({"message": "Expense not found!"}), 404

    return jsonify(expense.to_dict())


@api.route('/expenses/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()

    if not expense:
        return jsonify({"message": "Expense not found!"}), 404

    data = request.get_json()
    expense.amount = data.get("amount", expense.amount)
    expense.category = data.get("category", expense.category)

    db.session.commit()

    return jsonify({"message": "Expense updated successfully!", "expense": expense.to_dict()})


@api.route('/expenses/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    user_id = get_jwt_identity()
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()

    if not expense:
        return jsonify({"message": "Expense not found!"}), 404

    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Expense deleted successfully!"})
