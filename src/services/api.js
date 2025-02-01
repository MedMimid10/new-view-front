import axios from 'axios';

const API_BASE_URL = `${window.location.origin}/api`;

export const spotService = {
    getAllSpots: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/spots`);
            return response.data;
        } catch (error) {
            console.error('Error fetching spots:', error);
            throw error;
        }
    },

    getSpotById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/spots/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching spot:', error);
            throw error;
        }
    }
};

export const soukService = {
    getAllSouks: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/souks`);
            return response.data;
        } catch (error) {
            console.error('Error fetching souks:', error);
            throw error;
        }
    },

    getSoukById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/souks/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching souk:', error);
            throw error;
        }
    }
};

export const storeService = {
    getStoreDetails: async (storeId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stores/${storeId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching store details:', error);
            throw error;
        }
    },

    getStoreProducts: async (storeId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/store/${storeId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching store products:', error);
            throw error;
        }
    }
};

// services/authService.js
export const authService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// services/cartService.js
export const cartService = {
    addToCart: async (productId, quantity) => {
        console.log('Attempting to add to cart:', { productId, quantity });
        
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No authentication token found');
            throw new Error('Authentication required');
        }

        try {
            console.log('Sending cart request with token');
            const response = await axios.post(`${API_BASE_URL}/cart`, {
                productId,
                quantity
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Successfully added to cart:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error.response?.data || error.message);
            if (error.response?.status === 401 || error.response?.status === 403) {
                throw new Error('Please login to add items to cart');
            }
            throw error;
        }
    },

    getCartItems: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const cartServiceV = {
    addToCart: async (productId, quantity) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/cartV`, {
          productId,
          quantity
        }, {
          withCredentials: true // Important for session handling
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error ;
      }
    },
  
    getCartItems: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cartV`, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || 'Failed to fetch cart items';
      }
    },
  
    updateCartItemQuantity: async (cartItemId, productId, quantity) => {
      try {
        const response = await axios.patch(`${API_BASE_URL}/cartV/${cartItemId}`, {
          productId,
          quantity
        }, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || 'Failed to update cart item';
      }
    },
  
    removeFromCart: async (cartItemId) => {
      try {
        await axios.delete(`${API_BASE_URL}/cartV/${cartItemId}`, {
          withCredentials: true
        });
      } catch (error) {
        throw error.response?.data || 'Failed to remove item from cart';
      }
    }
  };

  export const orderVService = {
    createOrder: async (orderData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/orderV`, orderData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getOrder: async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/orderV/${orderId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

  };