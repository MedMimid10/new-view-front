import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { orderVService } from '../services/api';
import { toast } from 'react-toastify';
import './OrderForm.css';

const OrderForm = ({ isVisible, onClose, cartItems, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the createOrder method from orderVService
      const response = await orderVService.createOrder(formData);
      
      toast.success('Order placed successfully!');
      setFormData({ customerName: '', phoneNumber: '', email: '' }); // Reset form
      onOrderComplete(); // Close forms and refresh cart
      
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.customerName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  if (!isVisible) return null;

  return (
    <div className="order-form-overlay">
      <div className="order-form-popup">
        <div className="order-form-header">
          <h3>Complete Your Order</h3>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="customerName">Full Name</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="order-summary">
            <h4>Order Summary</h4>
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.productName} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Total:</strong>
              <strong>
                ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
              </strong>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-order-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing Order...' : 'Confirm Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;