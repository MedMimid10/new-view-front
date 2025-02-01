import React, { useState, useEffect } from 'react';
import { spotService, soukService } from '../services/api';
import { useNavigate } from 'react-router-dom';

import { faSearch, faMapMarkerAlt, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Container, Form, Image } from 'react-bootstrap';
import './Dashboard.css';
import EyeIcon from './assets/emoji_eye_.png';
import FireIcon from './assets/emoji_fire_.png';
import HeartIcon from './assets/emoji_heart.png';
import WaveHandIcon from './assets/emoji_waving_hand_sign_.png';

// Local images for the Viewed Items section
import Item1 from './assets/artisanat-marocain-exportations.jpg';
import Item3 from './assets/arton52787.jpg';
import Item2 from './assets/boufa.jpg';
import Item4 from './assets/istockphoto-1094424202-612x612.jpg';
import Item5 from './assets/theiere-moyenne.jpg';

import accessItem from './assets/accessoire.png';
import bagItem from './assets/Bags.png';
import cermItem from './assets/Ceramic.png';
import oilItem from './assets/Oil-Product.png';

function Dashboard() {

  const [spots, setSpots] = useState([]);
  const [souks, setSouks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const featuredSouk = {
    id: 'featured-souk-1',
    name: 'Souk El Bahja',
    description: 'Famous craft market in the heart of Marrakesh Medina',
    imageUrl: '/img-tourist.png', // Replace with your craft souk image
    location: 'Medina Quarter, Marrakesh',
    craftTypes: 'Leather, Carpets, Ceramics, Metalwork',
    timing: 'Open Daily • 9AM - 8PM',
    merchantCount: '150+ Artisans',
    videoUrlSouk: '/videos/masin lil.mp4'
  };
    
    const handleStartClick = (item) => {
      navigate('/videoPlayer', { 
          state: { 
              videoUrl: item.videoUrl,
              name: item.name,
              autoplay: true
          } 
      });
    };

    const handleExploreClick = () => {
      navigate('/videoPlayer', { 
          state: { 
              videoUrl: featuredSouk.videoUrlSouk,
              name: featuredSouk.name,
              autoplay: true
          } 
      });
    };

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [spotsData, souksData] = await Promise.all([
                spotService.getAllSpots(),
                soukService.getAllSouks()
            ]);
            
            setSpots(spotsData);
            setSouks(souksData);
            setLoading(false);
        } catch (err) {
            setError('Error fetching data');
            setLoading(false);
            console.error('Error:', err);
        }
    };

    fetchData();
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;
  
  const categoryItems = [
    { image: accessItem, title: "Accessories" },
    { image: bagItem, title: "Bags" },
    { image: cermItem, title: "Ceramic" },
    { image: oilItem, title: "Oil Product" },
    
  ];

  const viewedItems = [
    { image: Item1, title: "Item 1" },
    { image: Item2, title: "Item 2" },
    { image: Item3, title: "Item 3" },
    { image: Item4, title: "Item 4" },
    { image: Item5, title: "Item 5" },
  ];

  const likedItems = [
    { image: Item2, title: "Item 2" },
    { image: Item3, title: "Item 3" },
    { image: Item5, title: "Item 5" },
  ];

  return (
    <Container style={{ paddingBottom: '60px', paddingTop: '10px' }}>
      <div>
        <div className='welcome-title pb-3'>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="26" viewBox="0 0 216.13 139.379"><g fill-rule="evenodd" clip-rule="evenodd" stroke-miterlimit="2.613"><path fill="#cc2229" stroke="#cc2229" stroke-width=".13" d="M.065.065h215.999v139.248H.065V.065z"/><path d="M96.833 72.714l-12.96-9.432h29.519l-.646-2.088H76.242l19.584 14.832 1.007-3.312zm22.608.143l-11.592-33.479-7.632 21.816h3.096l4.608-14.472 9.288 27.792 2.232-1.657zm-8.712 10.296l-2.375-1.8 23.76-18H116.13l-.863-2.232h24.623l-29.161 22.032zm-22.464 16.849l19.8-14.832-2.304-1.8-12.816 9.647 9.72-29.736h-2.736l-11.664 36.721zm9.792-22.464l29.304 21.888-7.199-23.472-1.873 1.512 4.537 14.832-23.761-18.072-1.008 3.312z" fill="#62b16e" stroke="#000" stroke-width=".326"/></g></svg>
          <h3 className='title-mc ps-1'>MOROCCAN CULTURE</h3>
        </div>
        <Form>
          <Form.Group controlId="searchInput" className="input-icon mb-4">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <Form.Control
              className="search-input"
              type="text"
              placeholder="What are you looking for?"
            />
          </Form.Group>
        </Form>
      </div>

      <div className="featured-section mb-4">
        <div className="section-header mb-3">
          <h2 className="text-2xl font-bold">Visit And Buy Like Never Before</h2>
          <p className="text-gray-600">Leave The Culture Leave The Magic</p>
        </div>

        <Card 
          className="featured-souk"
          onClick={() => featuredSouk.videoUrlSouk && handleExploreClick()}
          style={{ cursor: featuredSouk.videoUrlSouk ? 'pointer' : 'not-allowed' }}
        >
          <div className="souk-image-container">
            <Card.Img 
              src={featuredSouk.imageUrl}
              alt={featuredSouk.name}
              className="souk-main-image"
            />
            <div className="souk-content-overlay">
              <div className="souk-main-info">
                <div className="souk-title-section">
                  <h3>{featuredSouk.name}</h3>
                  <p>{featuredSouk.description}</p>
                </div>

                <div className="souk-details-row">
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{featuredSouk.location}</span>
                  </div>
                  {/* <div className="detail-item">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{featuredSouk.timing}</span>
                  </div> */}
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faUser} />
                    <span>{featuredSouk.merchantCount}</span>
                  </div>
                </div>

                <Button className="explore-souk-btn" onClick={() => handleExploreClick()}>
                  Explore Now
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className='spot-ele'>
          <h3>Discover City<img src={FireIcon} alt="Fire"/></h3>
          <span>Show List</span>
        </div>

        <div className="card-container mb-4">
            {spots.map((spot) => (
                <Card 
                    key={spot.id} 
                    className={`scroll-card ${spot.videoUrl ? 'clickable-card' : 'disabled-card'}`}
                    onClick={() => spot.videoUrl && handleStartClick(spot)}
                    style={{ cursor: spot.videoUrl ? 'pointer' : 'not-allowed' }}
                >
                    <Card.Img 
                        variant="top" 
                        src={spot.imageUrl} 
                        alt={spot.name} 
                    />
                    <div className="info-btn">
                        <Card.Body className="card-info">
                            <Card.Title>{spot.name}</Card.Title>
                            <Card.Text>{spot.description}</Card.Text>
                        </Card.Body>
                        <Button 
                            variant={spot.videoUrl ? "primary" : "secondary"}
                            className={`card-btn ${!spot.videoUrl ? 'disabled-btn' : ''}`}
                            disabled={!spot.videoUrl}
                        >
                            {spot.videoUrl ? 'Start' : 'Coming Soon'}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
      </div>

      {/* <div>
        <div className='spot-ele'>
          <h3>Visit Souk<img src={FireIcon} alt="Fire"/></h3>
          <span>Show List</span>
        </div>

        <div className="card-container-2 mb-4">
          {souks.map((souk) => (
              <Card key={souk.id} className="scroll-card">
                  <Card.Img 
                      variant="top" 
                      src={souk.imageUrl || '/placeholder.jpg'} 
                      alt={souk.name} 
                  />
                  <div className="info-btn">
                      <Card.Body className="card-info">
                          <Card.Title>{souk.name}</Card.Title>
                          <Card.Text>{souk.theme}</Card.Text>
                      </Card.Body>
                      <Button variant="primary" className="card-btn">
                        Start
                      </Button>
                  </div>
              </Card>
            ))}
        </div>
      </div> */}

      <div>

      <div className='spot-ele'>
        <h3>Craft Categories<img src={EyeIcon} alt="EyeView" /></h3>
        <span>Show List</span>
      </div>

      <div className="image-containerC mb-3">
        {categoryItems.map((category, idx) => (
          <div key={idx} className="image-itemC">
            <Image 
              src={category.image} 
              roundedCircle 
              className="scroll-imageC" 
              alt={category.title} 
            />
            <p className='title-itemC'>{category.title}</p>
          </div>
        ))}
      </div>
    </div>


      <div>
        <div className='spot-ele'>
          <h3>Viewed Items<img src={EyeIcon} alt="EyeView"/></h3>
          <span>Show List</span>
        </div>

        <div className="image-container mb-3">
          {viewedItems.map((item, idx) => (
            <div key={idx} className="image-item">
              <Image src={item.image} roundedCircle className="scroll-image" alt={item.title} />
              <p className='title-item'>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className='spot-ele'>
          <h3>Liked Items<img src={HeartIcon} alt="LikeHeart"/></h3>
          <span>Show List</span>
        </div>

        <div className="image-container mb-3">
          {likedItems.map((item, idx) => (
            <div key={idx} className="image-item">
              <Image src={item.image} roundedCircle className="scroll-image" alt={item.title} />
              <p className='title-item'>{item.title}</p>
            </div>
          ))}
        </div>
      </div>  
    </Container>
  );
}

export default Dashboard;
