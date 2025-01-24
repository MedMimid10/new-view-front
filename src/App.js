import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMapMarkedAlt, faHeart, faCog, faList } from '@fortawesome/free-solid-svg-icons';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MapPage from './components/MapPage';
import OnboardingPage from './components/OnboardingPage';
import VideoPlayer from './components/VideoPlayer';
import SellerProfile from './components/SellerProfile';
import ProductPage from './components/ProductPage';
import './App.css';
import LandingPage from './components/LandingPage';

function App() {
  const [activeTab, setActiveTab] = useState('/');

  // Paths where the navbar should be hidden
  const hiddenNavbarPaths = ['/onboarding', '/videoPlayer', '/seller', '/product', '/landingPage', '/login', '/register' ];

  // Layout component to handle routes and navbar
  function Layout() {
    const location = useLocation();

    // Update activeTab when location changes
    useEffect(() => {
      setActiveTab(location.pathname);
    }, [location.pathname]);

    // Check if the current path matches any of the hiddenNavbarPaths
    const shouldHideNavbar = hiddenNavbarPaths.some((path) => location.pathname.startsWith(path));

    return (
      <>
        {/* Main Routes for Pages */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/landingPage' element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/videoPlayer" element={<VideoPlayer />} />
          <Route path="/seller/:storeId" element={<SellerProfile />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>

        {/* Mobile Navbar at the bottom */}
        {!shouldHideNavbar && (
          <nav className="mobile-navbar">
            <NavLink
              to="/"
              className={`nav-item ${activeTab === '/' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faHome} />
              {activeTab === '/' && <span>Home</span>}
            </NavLink>
            <NavLink
              to="/map"
              className={`nav-item ${activeTab === '/map' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faMapMarkedAlt} />
              {activeTab === '/map' && <span>Explore</span>}
            </NavLink>
            <NavLink
              to="/activity"
              className={`nav-item ${activeTab === '/activity' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faList} />
              {activeTab === '/activity' && <span>Activity</span>}
            </NavLink>
            <NavLink
              to="/like"
              className={`nav-item ${activeTab === '/like' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faHeart} />
              {activeTab === '/like' && <span>Like</span>}
            </NavLink>
            <NavLink
              to="/settings"
              className={`nav-item ${activeTab === '/settings' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faCog} />
              {activeTab === '/settings' && <span>Settings</span>}
            </NavLink>
          </nav>
        )}
      </>
    );
  }

  return (
    <div className="app-container">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
