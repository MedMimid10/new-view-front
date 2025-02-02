import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faArrowRight, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { cartServiceV } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import OrderForm from './OrderForm';
import './CartItems.css';

const CartItems = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);

    useEffect(() => {
        fetchCartItems();
    }, []);

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
            await fetchCartItems();
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
        fetchCartItems();
    };

    const handleExploreClick = () => {
        // Replace with your actual video URL or path
        navigate('/videoPlayer', { 
            state: { 
                videoUrl: 'marrakech-medina-video360.mp4',
                autoplay: true 
            } 
        });
    };

    return (
        <div className="cart-items-page">
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
            <h2>Shopping Cart</h2>

            <div className="cart-items-container">
                {isLoading ? (
                    <div className="cart-loading">Loading cart items...</div>
                ) : cartItems.length === 0 ? (
                    <div className="empty-cart-container">
                        <div className="empty-cart-content">
                            <div className="empty-cart-icon">
                                <FontAwesomeIcon icon={faShoppingBag} />
                            </div>
                            <h3>Your Cart is Empty</h3>
                            <p>Discover amazing products in our virtual souk!</p>
                            <button className="explore-button" onClick={handleExploreClick}>
                                Explore Souk
                                <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
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
                            ))}
                        </div>

                        <div className="cart-summary">
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
                    </>
                )}
            </div>

            <OrderForm
                isVisible={showOrderForm}
                onClose={() => setShowOrderForm(false)}
                cartItems={cartItems}
                onOrderComplete={handleOrderComplete}
            />
        </div>
    );
};

export default CartItems;