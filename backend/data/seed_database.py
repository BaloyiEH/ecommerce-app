from app import app, db
from models import Product

with app.app_context():
    db.drop_all()
    db.create_all()
    
    # Sample clothing products
    products = [
        Product(
            name="Classic White T-Shirt",
            description="100% Cotton premium t-shirt",
            price=24.99,
            image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            category="T-Shirts",
            stock=50,
            size="M",
            color="White"
        ),
        Product(
            name="Denim Jacket",
            description="Vintage washed denim jacket",
            price=89.99,
            image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
            category="Jackets",
            stock=25,
            size="L",
            color="Blue"
        ),
        Product(
            name="Black Jeans",
            description="Slim fit black jeans",
            price=69.99,
            image_url="https://images.unsplash.com/photo-1542272604-787c3835535d?w-400",
            category="Jeans",
            stock=30,
            size="32",
            color="Black"
        ),
        Product(
            name="Summer Dress",
            description="Floral print summer dress",
            price=59.99,
            image_url="https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w-400",
            category="Dresses",
            stock=20,
            size="S",
            color="Multicolor"
        ),
        Product(
            name="Running Shoes",
            description="Lightweight running shoes",
            price=119.99,
            image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w-400",
            category="Shoes",
            stock=40,
            size="10",
            color="Gray"
        ),
        Product(
            name="Wool Sweater",
            description="100% Merino wool sweater",
            price=79.99,
            image_url="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w-400",
            category="Sweaters",
            stock=15,
            size="XL",
            color="Navy"
        ),
        Product(
            name="Leather Handbag",
            description="Genuine leather handbag",
            price=149.99,
            image_url="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w-400",
            category="Accessories",
            stock=10,
            size="One Size",
            color="Brown"
        ),
        Product(
            name="Baseball Cap",
            description="Adjustable cotton cap",
            price=29.99,
            image_url="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w-400",
            category="Accessories",
            stock=100,
            size="Adjustable",
            color="Black"
        )
    ]
    
    for product in products:
        db.session.add(product)
    
    db.session.commit()
    print("Database seeded with sample products!")
