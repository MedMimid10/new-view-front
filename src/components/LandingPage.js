import React from 'react';
import { Navigation, Map, ShoppingBag, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // For any additional custom styles

import newViewImg from './assets/newView-iconX.png';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Hero Section */}
      <header className="text-center mt-4">
        <div className="containerX">
          <h1 className="text-land px-2">
            <span className="app-name-nv">New View</span> A Better Way to Navigate Virtually
          </h1>
        </div>
      </header>

      {/* App Screenshots */}
      <section className="screenshot-section position-relative">
        <div className="containerX">
          <div className="row">
            <div className="image-container position-relative">
              <div className="overlay-content d-flex flex-column justify-content-center align-items-center">
              <p className="text-style text-muted">
                Bringing a new perspective to navigation, New View uses cutting-edge AR technology to make
                every step of your journey smarter and more engaging.
              </p>
              <button className="btn-style btn btn-lg rounded-pill px-5" onClick={handleGetStartedClick}>Get Started</button>
              </div>
              <img
                src="/landing-image-new.jpg"
                alt="App landing img"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="containerX px-4">
          <div className="text-feature mb-5 d-flex align-items-center">
            <div className="btn-feature badge">Our Features</div>
            <p className="text-style-2 text-muted mb-0">
              Bringing a new perspective to navigation, New View uses cutting-edge AR technology to make
              every step of your journey smarter and more engaging.
            </p>
          </div>
          <div className="row g-4 ">
            {/* Feature: Map & AR Navigation */}
            <div className="col-md-4">
              <div className="card h-100 shadow border-0">
                <div className="card-body">
                  <div className="icon-title-container mb-3">
                    <Map className="icon-card" />
                    <span className="title-icon">Explore</span>
                  </div>
                  <h5 className="card-titleX">Map & Navigation</h5>
                  <img
                    src="/map-img.jpg"
                    alt="Map Navigation"
                    className="img-fluid rounded mt-3"
                  />
                </div>
              </div>
            </div>

            {/* Feature: Buy Products */}
            <div className="col-md-4">
              <div className="card h-100 shadow border-0">
                <div className="card-body">
                  <div className="icon-title-container mb-3">
                    <ShoppingBag className="icon-card" />
                    <span className="title-icon">Shop</span>
                  </div>
                  <h5 className="card-titleX">Buy Products</h5>
                  <img
                    src="/store-img.jpg"
                    alt="Shopping"
                    className="img-fluid rounded mt-3"
                  />
                </div>
              </div>
            </div>

            {/* Feature: Discover Activities */}
            <div className="col-md-4">
              <div className="card h-100 shadow border-0">
                <div className="card-body">
                  <div className="icon-title-container mb-3">
                    <Activity className="icon-card" />
                    <span className="title-icon">Activity</span>
                  </div>
                  <h5 className="card-titleX">Discover Activities</h5>
                  <img
                    src="/activity.jpg"
                    alt="Activities"
                    className="img-fluid rounded mt-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
  <footer className="footer mt-auto px-4 mb-5">
    <div className="footer-contentL d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <img src={newViewImg} alt="New View Logo" className="logo-footer me-2" />
        <span className="footer-app-name">New View</span>
      </div>
      <span className="footer-text">© 2025 New View. All rights reserved.</span>
    </div>
  </footer>
    </div>
  );
}

export default LandingPage;
