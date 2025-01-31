import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storeService, cartServiceV } from '../services/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar, faCartShopping, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import './SellerProfile.css';
import filterIcon from './assets/Frame.png';
import CartPopup from './CartPopup';
import { ToastContainer } from 'react-toastify';

//import balghineImage from './assets/balghine.jpg';
// import Item1 from './assets/artisanat-marocain-exportations.jpg';
// import Item3 from './assets/arton52787.jpg';
// import Item2 from './assets/balghine.jpg';

// import ItemX1 from './assets/juniper-1.jpeg';
// import ItemX2 from './assets/juniper-2.jpeg';
// import ItemX3 from './assets/juniper-3.jpeg';
// import ItemX4 from './assets/juniper-4.jpeg';

// import ItemB from './assets/background-wiss.jpeg';

// import Item4 from './assets/wissal-1.jpeg';
// import Item5 from './assets/wissal-2.jpeg';
// import Item6 from './assets/wissal-3.jpeg';
// import Item7 from './assets/wissal-4.jpeg';
// import Item8 from './assets/wissal-5.jpeg';


// Seller data can be passed dynamically through props or fetched from an API
// const sellerData = {
//   id: 'hamidStore',
//   name: 'Hamid Store',
//   profileImage: '/traditional-carp-logo.jpg',
//   rating: 4.2,
//   totalReviews: 9,
//   products: [
//     {
//       id: 1,
//       name: 'Traditional carpet 1',
//       price: 150,
//       rating: 4.5,
//       reviews: 120,
//       image: Item4,
//     },
//     {
//       id: 2,
//       name: 'Traditional carpet 2',
//       price: 80,
//       rating: 4.7,
//       reviews: 85,
//       image: Item5,
//     },
//     {
//       id: 3,
//       name: 'Traditional carpet 3',
//       price: 200,
//       rating: 4.8,
//       reviews: 250,
//       image: Item6,
//     },
//     {
//       id: 3,
//       name: 'Traditional carpet 4',
//       price: 200,
//       rating: 4.8,
//       reviews: 250,
//       image: Item7,
//     },
//     {
//       id: 3,
//       name: 'Traditional carpet 5',
//       price: 200,
//       rating: 4.8,
//       reviews: 250,
//       image: Item8,
//     },

//     // Add more products as needed
//   ],
// };

function SellerProfile() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  useEffect(() => {
    const fetchStoreData = async () => {
        try {
            setLoading(true);
            const [storeData, productsData] = await Promise.all([
                storeService.getStoreDetails(storeId),
                storeService.getStoreProducts(storeId)
            ]);
            setStore(storeData);
            setProducts(productsData);
            setLoading(false);
        } catch (err) {
            setError('Error loading store data');
            setLoading(false);
            console.error('Error:', err);
        }
    };

    fetchStoreData();
  }, [storeId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!store) return <div>Store not found</div>;

  return (
    <div className="seller-profile">
      {/* Header Section */}
      <header className="seller-header">
        <div className="profil-image">
          <img src={store.imageUrl} alt="" className='background-image'/>
          <button className="back-button" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className='icon-arrowL'/>
          </button>
          {/* New cart button */}
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
          <div className="profile-container">
            <img
              src={store.profileImageUrl}
              alt={`${store.name} Profile`}
              className="profile-image"
            />
          </div>
        </div>
        <div className="seller-info">
          <h1 className="seller-name">{store.name}</h1>
          <div className="product-meta">
            <div className="rating">
              <FontAwesomeIcon icon={faStar} className="star-icon" />
              <span>{store.rating}</span>
            </div>
            <div className="separator"></div>
            <div className="product-quantity">
              <span>{store.totalReviews} review</span>
            </div>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <section className="products">
        {/* Filter Options */}
        <div className="products-filter">
          <h2>Products</h2>
          <div className="filter-actions">
            <select className="sort-select">
              <option value="default">Sort by</option>
              <option value="price">Price</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
            </select>
            <button className="icon-button">
              <img src={filterIcon} alt="Filter Icon" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="image-wrapper">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      className={index < Math.round(product.rating) ? 'star-icon' : 'star-icon faded'}
                    />
                  ))}
                  <span className="reviews">({product.reviews})</span>
                </p>
                <p className="product-price">
                  <span>$</span>
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SellerProfile;
