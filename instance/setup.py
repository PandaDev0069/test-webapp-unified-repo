from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Configure SQLite Database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db = SQLAlchemy(app)

# Define Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    xp = db.Column(db.Integer, default=0)  # Track user XP

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "xp": self.xp
        }
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)  # Markdown content
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Food, Rent, Transport, etc.
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "category": self.category,
            "date": self.date.strftime("%Y-%m-%d")
        }

# Function to reset and create tables
def reset_database():
    """Drops all tables and recreates them."""
    with app.app_context():
        db.drop_all()  # Remove existing tables
        db.create_all()  # Recreate tables
        print("✅ Database has been reset successfully!")

# Function to add sample data
def seed_database():
    """Adds initial test users, tasks, notes, and expenses."""
    with app.app_context():
        user1 = User(username="testuser", email="test@example.com", password="hashedpassword")
        user2 = User(username="john_doe", email="john@example.com", password="hashedpassword")

        db.session.add_all([user1, user2])
        db.session.commit()

        # Adding sample tasks
        task1 = Task(user_id=user1.id, title="Complete Flask project", due_date=datetime(2025, 2, 15), completed=False)
        task2 = Task(user_id=user2.id, title="Submit CS50 project", due_date=datetime(2025, 3, 10), completed=True)

        db.session.add_all([task1, task2])
        db.session.commit()

        # Adding sample notes
        note1 = Note(user_id=user1.id, title="Flask Notes", content="### Learning Flask\n- Routing\n- Models\n- Database")
        note2 = Note(user_id=user2.id, title="React Basics", content="### React Guide\n- Components\n- Hooks\n- Props")

        db.session.add_all([note1, note2])
        db.session.commit()

        # Adding sample expenses
        expense1 = Expense(user_id=user1.id, amount=50.75, category="Food", date=datetime(2025, 2, 8))
        expense2 = Expense(user_id=user2.id, amount=1200, category="Rent", date=datetime(2025, 2, 1))

        db.session.add_all([expense1, expense2])
        db.session.commit()

        print("✅ Sample users, tasks, notes, and expenses have been added!")

# Run script
if __name__ == "__main__":
    reset_database()
    # seed_database()
