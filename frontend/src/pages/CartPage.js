import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <EmptyCartContainer>
        <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
        <ContinueShoppingButton onClick={() => navigate('/products')}>
          Continue Shopping
        </ContinueShoppingButton>
      </EmptyCartContainer>
    );
  }

  return (
    <Container>
      <CartHeader>
        <h1>Shopping Cart</h1>
        <ClearCartButton onClick={clearCart}>Clear Cart</ClearCartButton>
      </CartHeader>

      <CartContent>
        <CartItems>
          {cartItems.map(item => (
            <CartItem key={item.id}>
              <ProductImage src={item.image_url} alt={item.name} />
              <ProductDetails>
                <ProductName>{item.name}</ProductName>
                <ProductInfo>
                  <Size>Size: {item.size}</Size>
                  <Color>Color: {item.color}</Color>
                </ProductInfo>
                <ProductPrice>${item.price.toFixed(2)}</ProductPrice>
              </ProductDetails>
              
              <QuantityControls>
                <QuantityButton onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <FiMinus />
                </QuantityButton>
                <Quantity>{item.quantity}</Quantity>
                <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <FiPlus />
                </QuantityButton>
              </QuantityControls>
              
              <ItemTotal>${(item.price * item.quantity).toFixed(2)}</ItemTotal>
              
              <RemoveButton onClick={() => removeFromCart(item.id)}>
                <FiTrash2 />
              </RemoveButton>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>${getCartTotal().toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Shipping</SummaryLabel>
            <SummaryValue>$4.99</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Tax</SummaryLabel>
            <SummaryValue>${(getCartTotal() * 0.08).toFixed(2)}</SummaryValue>
          </SummaryRow>
          <Divider />
          <SummaryRow total>
            <SummaryLabel>Total</SummaryLabel>
            <SummaryValue>
              ${(getCartTotal() + 4.99 + (getCartTotal() * 0.08)).toFixed(2)}
            </SummaryValue>
          </SummaryRow>
          
          <CheckoutButton onClick={handleCheckout}>
            Proceed to Checkout
          </CheckoutButton>
          
          <ContinueShoppingButton onClick={() => navigate('/products')}>
            Continue Shopping
          </ContinueShoppingButton>
        </CartSummary>
      </CartContent>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
`;

const ClearCartButton = styled.button`
  background: #ff6b6b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #ff5252;
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  margin-bottom: 5px;
  color: #333;
`;

const ProductInfo = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
`;

const Size = styled.span``;
const Color = styled.span``;

const ProductPrice = styled.div`
  color: #ff6b6b;
  font-weight: bold;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #f0f2f5;
  }
`;

const Quantity = styled.span`
  font-weight: bold;
  min-width: 30px;
  text-align: center;
`;

const ItemTotal = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #333;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;

  &:hover {
    color: #ff5252;
  }
`;

const CartSummary = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
`;

const SummaryTitle = styled.h3`
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-weight: ${props => props.total ? 'bold' : 'normal'};
  font-size: ${props => props.total ? '18px' : '16px'};
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  color: #333;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const ContinueShoppingButton = styled.button`
  width: 100%;
  background: white;
  color: #333;
  padding: 15px;
  border: 2px solid #667eea;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f8f9fa;
  }
`;

const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  text-align: center;
`;

const EmptyCartMessage = styled.h2`
  color: #666;
  margin-bottom: 30px;
`;

export default CartPage;
