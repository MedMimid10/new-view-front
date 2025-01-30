import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { cartServiceV } from '../services/api';
import { toast } from 'react-toastify';
import OrderForm from './OrderForm';
import './CartPopup.css';

const CartPopup = ({ isVisible, onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    if (isVisible) {
      fetchCartItems();
    }
  }, [isVisible]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const items = await cartServiceV.getCartItems();
      setCartItems(items);
    } catch (error) {
      toast.error('Failed to fetch cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, productId, newQuantity) => {
    try {
      setIsUpdating(true);
      await cartServiceV.updateCartItemQuantity(cartItemId, productId, newQuantity);
      await fetchCartItems(); // Refresh cart after update
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      setIsUpdating(true);
      await cartServiceV.removeFromCart(cartItemId);
      await fetchCartItems();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrderComplete = () => {
    setShowOrderForm(false);
    onClose();
    fetchCartItems(); // Refresh cart items
  };
  
  if (!isVisible) return null;

  return (
    <>
        <div className="cart-popupV-overlay">
            <div className="cart-popup">
                <div className="cart-header">
                <h3>Shopping Cart</h3>
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                </div>

                <div className="cart-items">
                {isLoading ? (
                    <div className="cart-loading">Loading cart items...</div>
                ) : cartItems.length === 0 ? (
                    <div className="cart-empty">Your cart is empty</div>
                ) : (
                    cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <img 
                        src={item.productImgUrl} 
                        alt={item.productName} 
                        className="item-image"
                        />
                        
                        <div className="item-details">
                        <h4 className="item-name">{item.productName}</h4>
                        <div className="item-price">${item.price.toFixed(2)}</div>
                        
                        <div className="item-actions">
                            <div className="quantity-controls">
                            <button 
                                className="quantity-button"
                                onClick={() => handleUpdateQuantity(item.id, item.productId, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                                className="quantity-button"
                                onClick={() => handleUpdateQuantity(item.id, item.productId, item.quantity + 1)}
                                disabled={isUpdating}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            </div>
                            
                            <button 
                            className="remove-button"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating}
                            >
                            <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                        </div>
                    </div>
                    ))
                )}
                </div>

                {cartItems.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <button 
                    className="checkout-button"
                    onClick={() => setShowOrderForm(true)}
                    disabled={isUpdating}
                    >
                    Place Order
                    </button>
                </div>
                )}
            </div>

        </div>
        <OrderForm 
            isVisible={showOrderForm}
            onClose={() => setShowOrderForm(false)}
            cartItems={cartItems}
            onOrderComplete={handleOrderComplete}
        />
    </>
  );
};

export default CartPopup;