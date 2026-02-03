import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Nav>
        <NavContainer>
          <Logo to="/" onClick={closeMobileMenu}>
            FashionStore
          </Logo>

          <DesktopNavLinks>
            <NavLink to="/" onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={closeMobileMenu}>
              Products
            </NavLink>
            {user?.is_admin && (
              <NavLink to="/admin" onClick={closeMobileMenu}>
                Admin
              </NavLink>
            )}
          </DesktopNavLinks>

          <NavIcons>
            <CartIcon to="/cart" onClick={closeMobileMenu}>
              <FiShoppingCart />
              {getCartCount() > 0 && (
                <CartBadge>{getCartCount()}</CartBadge>
              )}
            </CartIcon>

            {user ? (
              <UserDropdown onMouseEnter={() => setDropdownOpen(true)}
                           onMouseLeave={() => setDropdownOpen(false)}>
                <UserIcon onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FiUser />
                  <UserName>{user.username}</UserName>
                </UserIcon>
                {dropdownOpen && (
                  <DropdownMenu>
                    <DropdownItem onClick={() => {
                      navigate('/profile');
                      setDropdownOpen(false);
                      closeMobileMenu();
                    }}>
                      Profile
                    </DropdownItem>
                    <DropdownItem onClick={() => {
                      navigate('/orders');
                      setDropdownOpen(false);
                      closeMobileMenu();
                    }}>
                      My Orders
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </UserDropdown>
            ) : (
              <AuthButtons>
                <LoginButton onClick={() => navigate('/login')}>
                  Login
                </LoginButton>
                <SignupButton onClick={() => navigate('/login')}>
                  Sign Up
                </SignupButton>
              </AuthButtons>
            )}

            <MobileMenuButton onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </MobileMenuButton>
          </NavIcons>
        </NavContainer>
      </Nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu>
          <MobileNavLinks>
            <MobileNavLink to="/" onClick={closeMobileMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/products" onClick={closeMobileMenu}>
              Products
            </MobileNavLink>
            {user?.is_admin && (
              <MobileNavLink to="/admin" onClick={closeMobileMenu}>
                Admin
              </MobileNavLink>
            )}
            <MobileNavLink to="/cart" onClick={closeMobileMenu}>
              Cart ({getCartCount()})
            </MobileNavLink>
            
            {user ? (
              <>
                <MobileNavLink to="/profile" onClick={closeMobileMenu}>
                  Profile
                </MobileNavLink>
                <MobileNavLink to="/orders" onClick={closeMobileMenu}>
                  My Orders
                </MobileNavLink>
                <MobileButton onClick={handleLogout}>
                  <FiLogOut /> Logout
                </MobileButton>
              </>
            ) : (
              <>
                <MobileButton onClick={() => {
                  navigate('/login');
                  closeMobileMenu();
                }}>
                  Login
                </MobileButton>
                <MobileButton primary onClick={() => {
                  navigate('/login');
                  closeMobileMenu();
                }}>
                  Sign Up
                </MobileButton>
              </>
            )}
          </MobileNavLinks>
        </MobileMenu>
      )}
    </>
  );
};

const Nav = styled.nav`
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &:hover {
    opacity: 0.9;
  }
`;

const DesktopNavLinks = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s;

  &:hover {
    color: #667eea;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CartIcon = styled(Link)`
  position: relative;
  color: #333;
  font-size: 24px;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f2f5;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff6b6b;
  color: white;
  font-size: 12px;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  min-width: 200px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 1001;
  margin-top: 10px;
`;

const DropdownItem = styled.div`
  padding: 12px 20px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #eee;
  margin: 5px 0;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginButton = styled.button`
  padding: 8px 20px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const SignupButton = styled.button`
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #333;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 999;
  max-height: calc(100vh - 70px);
  overflow-y: auto;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MobileNavLink = styled(Link)`
  padding: 15px 0;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  transition: color 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #667eea;
  }
`;

const MobileButton = styled.button`
  padding: 15px;
  margin: 10px 0;
  border: ${props => props.primary ? 'none' : '2px solid #667eea'};
  border-radius: 5px;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'white'};
  color: ${props => props.primary ? 'white' : '#667eea'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    opacity: ${props => props.primary ? '0.9' : '1'};
    background: ${props => !props.primary && '#f0f2f5'};
  }
`;

export default Navbar;
