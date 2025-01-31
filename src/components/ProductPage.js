import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar, faCartPlus, faPlus, faMinus, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './ProductPage.css';
import { cartServiceV } from '../services/api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartPopup from './CartPopup';

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state;
  const [count, setCount] = useState(1);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const items = await cartServiceV.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')} className="back-home-button">
          Back to Home
        </button>
      </div>
    );
  }

  const handleIncrement = () => {
    if (count < product.stockQuantity) {
      setCount((prevCount) => prevCount + 1);
    } else {
      toast.warning('Maximum available quantity reached');
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await cartServiceV.addToCart(product.id, count);
      await fetchCartItems();
      toast.success('Product added to cart!');
      setCount(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Unable to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="product-page">

      <CartPopup 
        isVisible={isCartVisible} 
        onClose={() => setIsCartVisible(false)} 
      />

      <ToastContainer 
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header section */}
      <header className="product-header">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FontAwesomeIcon icon={faArrowLeft} className='icon-arrowL'/>
        </button>
        <button 
          className="cart-button" 
          onClick={() => setIsCartVisible(!isCartVisible)}
          aria-label={`Shopping cart ${cartItems.length ? `with ${cartItems.length} items` : 'empty'}`}
        >
          <FontAwesomeIcon 
            icon={cartItems.length > 0 ? faCartPlus : faCartShopping} 
            className={cartItems.length > 0 ? 'cart-icon-filled' : 'cart-icon-empty'} 
          />
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </button>

        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-header-image" 
        />
      </header>
      
      {/* Product details */}
      <div className="product-details">
        <div className="product-info">
          <span className='product-type'>{product.category}</span>
          <h1>{product.name}</h1>
          <div className="product-price">
            ${product.price?.toFixed(2)}
          </div>
          <div className="product-meta">
            <div className="rating">
              <FontAwesomeIcon icon={faStar} className="star-icon" />
              <span>4.2</span>
            </div>
            <div className="separator"></div>
            <div className='product-quantity'>
              <span>{product.stockQuantity} available</span>
            </div>
          </div>
        </div>

        {/* Product attributes */}
        <div className="product-attributes">
          {/* Color column */}
          <div className="attribute-column">
            <h3>Color</h3>
            <div className="color-options">
              <div className="color-circle" style={{ backgroundColor: '#EF9735' }}></div>
              <div className="color-circle" style={{ backgroundColor: '#DB5B45' }}></div>
              <div className="color-circle" style={{ backgroundColor: '#7B9FD3' }}></div>
            </div>
          </div>
          
          {/* Size column */}
          <div className="attribute-column">
            <h3>Size</h3>
            <select className="size-select" defaultValue="">
              <option value="" disabled>Select size</option>
              <option value="S">Small (S)</option>
              <option value="M">Medium (M)</option>
              <option value="L">Large (L)</option>
              <option value="XL">Extra Large (XL)</option>
            </select>
          </div>
        </div>

        <div className='product-descrip'>
          <h4>Details</h4>
          <p>{product.description}</p>
        </div>
      </div>

      {/* Add to Cart Section */}
      <footer className="product-footer">
        <div className="footer-content">
          <div className="product-quantity-control">
            <button 
              className="quantity-button" 
              onClick={handleDecrement}
              disabled={isLoading || count <= 1}
              aria-label="Decrease quantity"
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="quantity-count">{count}</span>
            <button 
              className="quantity-button" 
              onClick={handleIncrement}
              disabled={isLoading || count >= product.stockQuantity}
              aria-label="Increase quantity"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <button 
            className="add-to-cart-button" 
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faCartPlus} className="cart-icon" />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;