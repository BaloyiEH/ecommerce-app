import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';

const ProductDisplayPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      
      const uniqueCategories = ['all', ...new Set(response.data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Container>
      <Filters>
        <CategoryFilter>
          <FilterLabel>Category:</FilterLabel>
          <CategoryButtons>
            {categories.map(category => (
              <CategoryButton
                key={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </CategoryButton>
            ))}
          </CategoryButtons>
        </CategoryFilter>
        
        <SortFilter>
          <FilterLabel>Sort by:</FilterLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </Select>
        </SortFilter>
      </Filters>

      <ProductGrid>
        {filteredProducts.map(product => (
          <ProductCard key={product.id}>
            <ProductImage src={product.image_url} alt={product.name} />
            <ProductInfo>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductName>{product.name}</ProductName>
              <ProductDescription>{product.description}</ProductDescription>
              <ProductDetails>
                <Size>Size: {product.size}</Size>
                <Color>Color: {product.color}</Color>
                <Stock>In Stock: {product.stock}</Stock>
              </ProductDetails>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
              <ButtonGroup>
                <AddToCartButton onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </AddToCartButton>
                <ViewDetailsButton>
                  View Details
                </ViewDetailsButton>
              </ButtonGroup>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Filters = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const CategoryFilter = styled.div`
  flex: 1;
`;

const FilterLabel = styled.span`
  font-weight: bold;
  margin-right: 10px;
  color: #333;
`;

const CategoryButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const CategoryButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? '#667eea' : '#f0f2f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#e4e6eb'};
  }
`;

const SortFilter = styled.div`
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  font-size: 14px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductCategory = styled.span`
  display: inline-block;
  background: #f0f2f5;
  color: #666;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  margin-bottom: 10px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const ProductDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 13px;
  color: #888;
`;

const Size = styled.span``;
const Color = styled.span``;
const Stock = styled.span``;

const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const ViewDetailsButton = styled.button`
  flex: 1;
  background: #f8f9fa;
  color: #333;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e9ecef;
  }
`;

export default ProductDisplayPage;
