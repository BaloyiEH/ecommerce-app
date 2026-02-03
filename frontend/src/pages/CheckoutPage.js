import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    saveInfo: false
  });

  const subtotal = getCartTotal();
  const shipping = 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const orderData = {
        user_id: user?.id || 1,
        total: total,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        payment_method: formData.paymentMethod,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await axios.post('/api/orders', orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order error:', error);
    }
  };

  return (
    <Container>
      <CheckoutForm onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Shipping Information</SectionTitle>
          <FormRow>
            <FormGroup>
              <Label>First Name *</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Last Name *</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Email *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label>Address *</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label>City *</Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>State *</Label>
              <Input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>ZIP Code *</Label>
              <Input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>Payment Method</SectionTitle>
          <PaymentMethods>
            <PaymentMethod>
              <PaymentRadio
                type="radio"
                id="credit-card"
                name="paymentMethod"
                value="credit-card"
                checked={formData.paymentMethod === 'credit-card'}
                onChange={handleChange}
              />
              <PaymentLabel htmlFor="credit-card">
                Credit Card
              </PaymentLabel>
            </PaymentMethod>
            <PaymentMethod>
              <PaymentRadio
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleChange}
              />
              <PaymentLabel htmlFor="paypal">
                PayPal
              </PaymentLabel>
            </PaymentMethod>
          </PaymentMethods>
          
          {formData.paymentMethod === 'credit-card' && (
            <CardDetails>
              <FormGroup>
                <Label>Card Number *</Label>
                <Input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label>Expiry Date *</Label>
                  <Input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>CVC *</Label>
                  <Input
                    type="text"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </FormGroup>
              </FormRow>
            </CardDetails>
          )}
        </FormSection>

        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            id="saveInfo"
            name="saveInfo"
            checked={formData.saveInfo}
            onChange={handleChange}
          />
          <CheckboxLabel htmlFor="saveInfo">
            Save my information for next time
          </CheckboxLabel>
        </CheckboxGroup>
      </CheckoutForm>

      <OrderSummary>
        <SummaryTitle>Order Summary</SummaryTitle>
        <OrderItems>
          {cartItems.map(item => (
            <OrderItem key={item.id}>
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
              </ItemInfo>
              <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
            </OrderItem>
          ))}
        </OrderItems>
        
        <SummaryDetails>
          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Shipping</SummaryLabel>
            <SummaryValue>${shipping.toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Tax</SummaryLabel>
            <SummaryValue>${tax.toFixed(2)}</SummaryValue>
          </SummaryRow>
          <Divider />
          <SummaryRow total>
            <SummaryLabel>Total</SummaryLabel>
            <SummaryValue>${total.toFixed(2)}</SummaryValue>
          </SummaryRow>
        </SummaryDetails>
        
        <PlaceOrderButton onClick={handleSubmit}>
          Place Order
        </PlaceOrderButton>
        
        <SecurityNote>
          🔒 Your payment information is secure and encrypted
        </SecurityNote>
      </OrderSummary>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const FormSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  color: #333;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const PaymentMethod = styled.div`
  flex: 1;
`;

const PaymentRadio = styled.input`
  margin-right: 10px;
`;

const PaymentLabel = styled.label`
  font-weight: 500;
  cursor: pointer;
`;

const CardDetails = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const CheckboxLabel = styled.label`
  color: #666;
  cursor: pointer;
`;

const OrderSummary = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  height: fit-content;
`;

const SummaryTitle = styled.h3`
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  color: #333;
`;

const OrderItems = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ItemQuantity = styled.div`
  font-size: 14px;
  color: #666;
`;

const ItemPrice = styled.div`
  font-weight: bold;
`;

const SummaryDetails = styled.div`
  margin-bottom: 30px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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

const PlaceOrderButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const SecurityNote = styled.div`
  text-align: center;
  margin-top: 15px;
  color: #666;
  font-size: 14px;
`;

export default CheckoutPage;
