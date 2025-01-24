import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar, faCartPlus, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './ProductPage.css'; // Ensure styles are updated for the new feature
import { cartService, authService } from '../services/api.js';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state; // Retrieve product data passed via state

  const [count, setCount] = useState(1); // Initialize count state
  const [showAuthModal, setShowAuthModal] = useState(false);


  if (!product) {
    return <div>Product not found!</div>;
  }

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1)); // Ensure count doesn't go below 1
  };

  // const handleAddToCart = () => {
  //   alert(`Added ${count} of ${product.name} to the cart!`);
  //   // Integrate actual cart functionality here
  // };


  const handleAddToCart = async () => {
    console.log('Add to cart clicked:', { product, count });
    
    if (!authService.isAuthenticated()) {
        console.log('User not authenticated, showing modal');
        setShowAuthModal(true);
        return;
    }

    try {
        await cartService.addToCart(product.id, count);
        console.log('Successfully added to cart');
        toast.success('Product added to cart successfully!');
    } catch (error) {
        console.error('Error in handleAddToCart:', error);
        if (error.message === 'Please login to add items to cart') {
            setShowAuthModal(true);
        } else {
            toast.error('Failed to add product to cart');
        }
    }
};

const handleAuthRedirect = () => {
  setShowAuthModal(false); // Close the modal
  navigate('/login', { 
      state: { 
          returnTo: location.pathname,
          product: product,
          quantity: count
      } 
  });
};

  return (
    <div className="product-page">
      {/* Header section */}
      <header className="product-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className='icon-arrowL'/>
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
          <div className="product-meta">
            <div className="rating">
              <FontAwesomeIcon icon={faStar} className="star-icon" />
              <span>4.2</span>
            </div>
            <div className="separator"></div>
            <div className='product-quantity'>
              <span>9 available</span>
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
            <select className="size-select">
              <option value="">Select size</option>
              <option value="S">Small (S)</option>
              <option value="M">Medium (M)</option>
              <option value="L">Large (L)</option>
              <option value="XL">Extra Large (XL)</option>
            </select>
          </div>
        </div>

        <div className='product-descrip'>
          <h4>Details</h4>
          <p>
            {product.description}
          </p>
        </div>
      </div>

      {/* Authentication Modal */}
      <Modal show={showAuthModal} onHide={() => setShowAuthModal(false)}>
          <Modal.Header closeButton>
              <Modal.Title>Authentication Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              Please log in or create an account to add items to your cart.
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAuthModal(false)}>
                  Cancel
              </Button>
              <Button className='btn btn-auth' onClick={handleAuthRedirect}>
                  Log In / Register
              </Button>
          </Modal.Footer>
      </Modal>

      {/* Add to Cart Section */}
      <footer className="product-footer">
        <div className="footer-content">
          <div className="product-quantity-control">
            <button className="quantity-button" onClick={handleDecrement}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="quantity-count">{count}</span>
            <button className="quantity-button" onClick={handleIncrement}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            <FontAwesomeIcon icon={faCartPlus} className="cart-icon" />
            Add to Cart
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
