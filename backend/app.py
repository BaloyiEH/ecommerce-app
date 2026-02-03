from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from models import db, Product, User, Order, OrderItem
from auth import auth_bp
from chatbot import chatbot_bp
import sqlite3

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')

# Create tables
with app.app_context():
    db.create_all()

# Products Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'image_url': p.image_url,
        'category': p.category,
        'stock': p.stock,
        'size': p.size,
        'color': p.color
    } for p in products])

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'image_url': product.image_url,
        'category': product.category,
        'stock': product.stock,
        'size': product.size,
        'color': product.color
    })

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.json
    product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        image_url=data['image_url'],
        category=data['category'],
        stock=data['stock'],
        size=data['size'],
        color=data['color']
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'message': 'Product created', 'id': product.id}), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.json
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.stock = data.get('stock', product.stock)
    db.session.commit()
    return jsonify({'message': 'Product updated'})

# Orders Routes
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    order = Order(
        user_id=data['user_id'],
        total=data['total'],
        status='pending',
        shipping_address=data['shipping_address'],
        payment_method=data['payment_method']
    )
    db.session.add(order)
    db.session.commit()
    
    for item in data['items']:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            price=item['price']
        )
        db.session.add(order_item)
    
    db.session.commit()
    return jsonify({'message': 'Order created', 'order_id': order.id}), 201

@app.route('/api/admin/orders', methods=['GET'])
def get_all_orders():
    orders = Order.query.all()
    return jsonify([{
        'id': o.id,
        'user_id': o.user_id,
        'total': o.total,
        'status': o.status,
        'created_at': o.created_at.isoformat(),
        'shipping_address': o.shipping_address
    } for o in orders])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
