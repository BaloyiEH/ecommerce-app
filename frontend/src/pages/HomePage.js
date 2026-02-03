import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Chatbot from '../components/Chatbot';
import axios from 'axios';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Summer Collection 2024</HeroTitle>
          <HeroSubtitle>Up to 50% off on selected items</HeroSubtitle>
          <ShopButton to="/products">Shop Now</ShopButton>
        </HeroContent>
      </HeroSection>

      <FeaturedSection>
        <SectionTitle>Featured Products</SectionTitle>
        <ProductGrid>
          {featuredProducts.map(product => (
            <ProductCard key={product.id}>
              <ProductImage src={product.image_url} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                <ViewButton to={`/products`}>View Details</ViewButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </FeaturedSection>

      <InfoSection>
        <InfoCard>
          <InfoIcon>🚚</InfoIcon>
          <InfoTitle>Free Shipping</InfoTitle>
          <InfoText>On orders over $50</InfoText>
        </InfoCard>
        <InfoCard>
          <InfoIcon>↩️</InfoIcon>
          <InfoTitle>Easy Returns</InfoTitle>
          <InfoText>30-day return policy</InfoText>
        </InfoCard>
        <InfoCard>
          <InfoIcon>🔒</InfoIcon>
          <InfoTitle>Secure Payment</InfoTitle>
          <InfoText>100% secure payment</InfoText>
        </InfoCard>
      </InfoSection>

      {/* Chatbot Button */}
      <ChatbotButton onClick={() => setShowChatbot(!showChatbot)}>
        💬
      </ChatbotButton>

      {/* Chatbot Component */}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const HeroSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200');
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-bottom: 40px;
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  margin-bottom: 30px;
`;

const ShopButton = styled(Link)`
  background: #ff6b6b;
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const FeaturedSection = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 36px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-10px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductName = styled.h3`
  margin-bottom: 10px;
  font-size: 18px;
`;

const ProductPrice = styled.p`
  color: #ff6b6b;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const ViewButton = styled(Link)`
  display: inline-block;
  background: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background: #555;
  }
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const InfoCard = styled.div`
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 10px;
`;

const InfoIcon = styled.div`
  font-size: 40px;
  margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 20px;
`;

const InfoText = styled.p`
  color: #666;
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #ff6b6b;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
  }
`;

export default HomePage;
