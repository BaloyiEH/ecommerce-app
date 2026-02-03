import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock: '',
    size: '',
    color: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleProductFormChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, productForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated successfully');
      } else {
        await axios.post('/api/products', productForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product added successfully');
      }
      
      fetchProducts();
      resetProductForm();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      stock: product.stock,
      size: product.size,
      color: product.color
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: '',
      stock: '',
      size: '',
      color: ''
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <Container>
      <Header>
        <h1>Admin Dashboard</h1>
        <Button onClick={() => setShowProductForm(true)}>
          <FiPlus /> Add Product
        </Button>
      </Header>

      {showProductForm && (
        <ProductFormContainer>
          <FormTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</FormTitle>
          <ProductForm onSubmit={handleAddProduct}>
            <FormRow>
              <FormGroup>
                <Label>Product Name *</Label>
                <Input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Price *</Label>
                <Input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  step="0.01"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={productForm.description}
                onChange={handleProductFormChange}
                rows="3"
              />
            </FormGroup>

            <FormGroup>
              <Label>Image URL</Label>
              <Input
                type="url"
                name="image_url"
                value={productForm.image_url}
                onChange={handleProductFormChange}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>Category</Label>
                <Select
                  name="category"
                  value={productForm.category}
                  onChange={handleProductFormChange}
                >
                  <option value="">Select Category</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Sweaters">Sweaters</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Stock *</Label>
                <Input
                  type="number"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleProductFormChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Size</Label>
                <Input
                  type="text"
                  name="size"
                  value={productForm.size}
                  onChange={handleProductFormChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Color</Label>
                <Input
                  type="text"
                  name="color"
                  value={productForm.color}
                  onChange={handleProductFormChange}
                />
              </FormGroup>
            </FormRow>

            <ButtonGroup>
              <SubmitButton type="submit">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </SubmitButton>
              <CancelButton type="button" onClick={resetProductForm}>
                Cancel
              </CancelButton>
            </ButtonGroup>
          </ProductForm>
        </ProductFormContainer>
      )}

      <DashboardGrid>
        <ProductsSection>
          <SectionTitle>Product Inventory</SectionTitle>
          <ProductList>
            {products.map(product => (
              <ProductItem key={product.id}>
                <ProductImage src={product.image_url} alt={product.name} />
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductMeta>
                    <span>${product.price}</span>
                    <span>Stock: {product.stock}</span>
                    <span>{product.category}</span>
                  </ProductMeta>
                </ProductInfo>
                <ActionButtons>
                  <EditButton onClick={() => handleEditProduct(product)}>
                    <FiEdit />
                  </EditButton>
                  <DeleteButton onClick={() => handleDeleteProduct(product.id)}>
                    <FiTrash2 />
                  </DeleteButton>
                </ActionButtons>
              </ProductItem>
            ))}
          </ProductList>
        </ProductsSection>

        <OrdersSection>
          <SectionTitle>Recent Orders</SectionTitle>
          <OrdersList>
            {orders.map(order => (
              <OrderItem key={order.id}>
                <OrderInfo>
                  <OrderId>Order #{order.id}</OrderId>
                  <OrderTotal>${order.total}</OrderTotal>
                  <OrderDate>{new Date(order.created_at).toLocaleDateString()}</OrderDate>
                  <OrderAddress>{order.shipping_address}</OrderAddress>
                </OrderInfo>
                <OrderActions>
                  <StatusSelect
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </StatusSelect>
                </OrderActions>
              </OrderItem>
            ))}
          </OrdersList>
        </OrdersSection>
      </DashboardGrid>

      <StatsSection>
        <StatCard>
          <StatTitle>Total Products</StatTitle>
          <StatValue>{products.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Orders</StatTitle>
          <StatValue>{orders.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Low Stock</StatTitle>
          <StatValue>
            {products.filter(p => p.stock < 10).length}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Revenue</StatTitle>
          <StatValue>
            ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
          </StatValue>
        </StatCard>
      </StatsSection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;

  h1 {
    color: #333;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const ProductFormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const FormTitle = styled.h3`
  margin-bottom: 20px;
  color: #333;
`;

const ProductForm = styled.form``;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
  min-height: 80px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  background: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: #f8f9fa;
  color: #333;
  padding: 12px 30px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ProductsSection = styled.div``;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  color: #333;
`;

const ProductList = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProductItem = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h4`
  margin-bottom: 8px;
  color: #333;
`;

const ProductMeta = styled.div`
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 14px;

  span {
    padding: 4px 8px;
    background: #f0f2f5;
    border-radius: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  background: #4CAF50;
  color: white;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const DeleteButton = styled.button`
  background: #ff6b6b;
  color: white;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const OrdersSection = styled.div``;

const OrdersList = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const OrderItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const OrderInfo = styled.div`
  margin-bottom: 15px;
`;

const OrderId = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const OrderTotal = styled.div`
  font-size: 18px;
  color: #ff6b6b;
  margin-bottom: 5px;
`;

const OrderDate = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const OrderAddress = styled.div`
  font-size: 14px;
  color: #888;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OrderActions = styled.div``;

const StatusSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background: white;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #667eea;
`;

export default AdminInventoryPage;
