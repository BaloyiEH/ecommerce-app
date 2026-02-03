from flask import Blueprint, request, jsonify
import json
import random

chatbot_bp = Blueprint('chatbot', __name__)

# Simple chatbot responses
responses = {
    "greeting": ["Hello! How can I help you today?", "Hi there! Looking for something special?", "Welcome to our store! Need assistance?"],
    "hours": ["We're open 24/7 online! Orders ship Monday-Friday 9AM-5PM."],
    "shipping": ["Standard shipping: 3-5 business days, $4.99\nExpress shipping: 1-2 business days, $9.99"],
    "returns": ["We accept returns within 30 days of purchase. Items must be unworn with tags attached."],
    "payment": ["We accept Visa, MasterCard, American Express, PayPal, and Apple Pay."],
    "size_help": ["Check our size guide on each product page. If unsure, order multiple sizes and return what doesn't fit!"],
    "default": ["I'm not sure about that. Can you contact customer service at support@fashionstore.com?"]
}

def get_chatbot_response(message):
    message = message.lower()
    
    if any(word in message for word in ['hello', 'hi', 'hey']):
        return random.choice(responses['greeting'])
    elif any(word in message for word in ['hour', 'open', 'close']):
        return random.choice(responses['hours'])
    elif any(word in message for word in ['ship', 'delivery', 'shipping']):
        return random.choice(responses['shipping'])
    elif any(word in message for word in ['return', 'refund', 'exchange']):
        return random.choice(responses['returns'])
    elif any(word in message for word in ['pay', 'payment', 'card', 'credit']):
        return random.choice(responses['payment'])
    elif any(word in message for word in ['size', 'fit', 'measurement']):
        return random.choice(responses['size_help'])
    else:
        return random.choice(responses['default'])

@chatbot_bp.route('/message', methods=['POST'])
def chatbot_message():
    data = request.json
    user_message = data.get('message', '')
    response = get_chatbot_response(user_message)
    
    return jsonify({
        'response': response,
        'suggestions': [
            "Shipping policy",
            "Return policy",
            "Size guide",
            "Payment methods"
        ]
    })
