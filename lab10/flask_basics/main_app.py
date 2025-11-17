from flask import Flask, render_template, redirect, url_for, request, abort, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "this is a secret key"

db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# Create tables
with app.app_context():
    db.create_all()
    
    # Add default users if database is empty
    if User.query.count() == 0:
        default_users = [
            User(username="alice", password="qwert"),
            User(username="bob", password="asdfg"),
            User(username="charlie", password="zxcvb")
        ]
        for user in default_users:
            db.session.add(user)
        db.session.commit()
        print("Default users added to database")

@app.route("/")
def default():
    return redirect(url_for("login_controller"))

@app.route("/login", methods=["GET", "POST"])
def login_controller():
    # Rebuild users dictionary from database
    users = {}
    all_users = User.query.all()
    for user in all_users:
        users[user.username] = user.password
    
    if "username" in session:
        return redirect(url_for("profile", username=session["username"]))

    # process HTTP GET requests
    if request.method == "GET": 
        return render_template("login.html")

    # process HTTP POST requests
    elif request.method == "POST":
        entered_username = request.form["user"]
        # checking if the user is in the users database
        if entered_username in users:
            # checking if the right password has been entered
            entered_password = request.form["pass"]
            database_password = users[entered_username]
            if entered_password == database_password:
                session["username"] = request.form["user"]
                # redirect the user to his/her profile page
                return redirect(url_for("profile", username=entered_username))
            else:
                # wrong password
                print("Login route: POST Request: wrong password: aborting process...")
                abort(401)
        else:
            # wrong username
            print("Login route: POST request: user is not registered in the database: Aborting process...")
            abort(404)

@app.route("/register", methods=["GET", "POST"])
def register_controller():
    if request.method == "GET":
        return render_template("register.html")
    
    elif request.method == "POST":
        new_username = request.form["user"]
        new_password = request.form["pass"]
        
        # Check if username already exists
        existing_user = User.query.filter_by(username=new_username).first()
        if existing_user:
            print(f"Registration failed: Username '{new_username}' already exists")
            abort(409)  # Conflict
        
        # Create new user
        new_user = User(username=new_username, password=new_password)
        db.session.add(new_user)
        db.session.commit()
        
        print(f"New user '{new_username}' registered successfully")
        return redirect(url_for("login_controller"))

@app.route("/profile/<username>")
def profile(username):
    return render_template("current_profile.html", username=username, reference_to_logout_page = url_for("unlogger"))

@app.route("/logout/")
def unlogger():
    # if logged in, log out, otherwise offer to log in
    if "username" in session:
        session.clear()
        return render_template("logout.html")
    else:
        return redirect(url_for("login_controller"))

if __name__ == "__main__":
    app.run(debug=True)