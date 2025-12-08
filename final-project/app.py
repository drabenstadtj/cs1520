from flask import Flask, render_template, redirect, url_for, request, abort, session
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__,
    template_folder="/home/drabenstadtj/final-project",
    static_folder="/home/drabenstadtj/final-project/static")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "this is a secret key"

db = SQLAlchemy(app)

# Database Models
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    table_number = db.Column(db.Integer, nullable=False)
    orders = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def __repr__(self):
        return f'<Order {self.id} - {self.customer_name}>'

# Routes
@app.route("/<int:table_number>")
def index(table_number):
    """Main menu route - accepts table number from QR code"""
    return render_template('main_menu.html', table_number=table_number)

@app.route("/kitchen/")
def kitchen():
    """Kitchen page showing all current orders"""
    orders = Order.query.order_by(Order.timestamp.desc()).all()
    return render_template('kitchen.html', orders=orders)

@app.route("/order/<int:table_number>", methods=['POST'])
def place_order(table_number):
    """Process order submission"""
    customer_name = request.form.get('customer_name')
    order_summary = request.form.get('orders')
    
    if not customer_name or not order_summary:
        return redirect(url_for('index', table_number=table_number))
    
    # Create new order
    new_order = Order(
        customer_name=customer_name,
        table_number=table_number,
        orders=order_summary
    )
    
    # Save to database
    db.session.add(new_order)
    db.session.commit()
    
    # Redirect to order summary
    return redirect(url_for('order_summary_view', order_id=new_order.id))

@app.route("/order_summary/<int:order_id>")
def order_summary_view(order_id):
    """Display order confirmation"""
    order = Order.query.get_or_404(order_id)
    return render_template('order_summary.html', order=order)

@app.route("/delete/<int:order_id>")
def delete_order(order_id):
    """Delete an order from kitchen"""
    order = Order.query.get_or_404(order_id)
    db.session.delete(order)
    db.session.commit()
    return redirect(url_for('kitchen'))

# Initialize database
with app.app_context():
    db.create_all()
