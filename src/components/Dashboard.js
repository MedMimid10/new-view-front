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
    merchantCount: '150+ Artisans'
  };
    
    const handleStartClick = (item) => {
      navigate('/videoPlayer', { 
          state: { 
              videoUrl: item.videoUrl,
              name: item.name
          } 
      });
    };

    const handleExploreClick = () => {
      navigate('/videoPlayer', { 
          state: { 
              videoUrl: "/videos/marrakech-medina-video360.mp4",
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
        <h3 className='welcome-title pb-1'>Hello user<img src={WaveHandIcon} alt="WaveHand"/></h3>
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

      <div className="featured-section mb-5">
        <div className="section-header mb-3">
          <h2 className="text-2xl font-bold">Visit Souks Like Never Before</h2>
          <p className="text-gray-600">Discover the Magic of Marrakesh's Artisan Markets</p>
        </div>

        <Card className="featured-souk">
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
                <Card key={spot.id} className="scroll-card">
                    <Card.Img 
                        variant="top" 
                        src={spot.imageUrl || '/placeholder.jpg'} 
                        alt={spot.name} 
                    />
                    <div className="info-btn">
                        <Card.Body className="card-info">
                            <Card.Title>{spot.name}</Card.Title>
                            <Card.Text>{spot.description}</Card.Text>
                        </Card.Body>
                        <Button variant="primary" className="card-btn" onClick={() => handleStartClick(spot)}>
                          Start
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
