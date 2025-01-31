import React, { useEffect, useRef, useState } from 'react';
import { spotService, soukService } from '../services/api';

//import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MapPage.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWltaWQxMCIsImEiOiJjbTJ0aXJsNXkwMzloMmlyNWRicnBmNHg4In0.rQ2E2Wn1TD98WEqvoO8g_w';

const MapPage = () => {
  const mapContainerRef = useRef(null);
  const popupRef = useRef(null);
  const cardContainerRef = useRef(null);
  
  const [popupContent, setPopupContent] = useState(null);  // Content for the route popup
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);  // Tracks the display of the welcome popup
  const [showCardContainer, setShowCardContainer] = useState(false); // Manages the card container visibility
  const [selectedSpotId, setSelectedSpotId] = useState(null); // Tracks the selected spot

  const [spots, setSpots] = useState([]);
  const [souks, setSouks] = useState([]);
  const [selectedType, setSelectedType] = useState('spots');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  // Handler for button click
  const handleStartClick = (item) => {
    navigate('/videoPlayer', { 
        state: { 
            videoUrl: item.videoUrl,
            name: item.name,
            type: selectedType
        } 
    });
  };

  // const SuggestSpots = [
  //   { id:1, image: '/historic-mon-icons/koutoubia.jpg', title: "Spot 1", description: "Description for Spot 1" },
  //   { id:2, image: '/historic-mon-icons/Place-Jemaa-El-Fna-Marrakech-tombée-de-la-Nuit.jpg', title: "Spot 2", description: "Description for Spot 2" },
  //   { id:3, image: '/historic-mon-icons/le-jardin-secret.jpg', title: "Spot 3", description: "Description for Spot 3" },
  //   { id:4, image: '/historic-mon-icons/ok-medersa-ben-youssef.jpg', title: "Spot 4", description: "Description for Spot 4" },
  //   { id:5, image: '/historic-mon-icons/Rahba+Kedima+Square.jpg', title: "Spot 5", description: "Description for Spot 5" },
  //   { id:6, image: '/historic-mon-icons/The-Museum-Dar-Si-Said-Marrakech-design.jpg', title: "Spot 6", description: "Description for Spot 6" },
  //   { id:7, image: '/historic-mon-icons/bahia-palace.jpg', title: "Spot 7", description: "Description for Spot 7" },
  //   { id:8, image: '/historic-mon-icons/History-of-El-Badi-Palace-2.jpg', title: "Spot 8", description: "Description for Spot 8" },
  //   { id:9, image: '/historic-mon-icons/saadian-tombs.jpg', title: "Spot 9", description: "Description for Spot 9" },
  //   {
  //     id:10, image: '/artisanat-souk/category-1.jpeg', title: "Souk 1", description: "Description for Souk 1"
  //   },

  // ];

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

  // Function to get current items based on selection
  const getCurrentItems = () => selectedType === 'spots' ? spots : souks;

  useEffect(() => {
    if (!spots.length) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-7.9870, 31.6295], // Centered around Marrakesh
      zoom: 13,
    });

    // const directions = new MapboxDirections({
    //   accessToken: mapboxgl.accessToken,
    //   unit: 'metric',
    //   profile: 'mapbox/walking',
    //   alternatives: true,
    //   geometries: 'geojson',
    // });
    // map.addControl(directions, 'top-left');

    // Define Medina polygon coordinates
    const medinaCoordinates = [
      [ 
        [-7.97460,31.62394],
        [-7.97352,31.62435],
        [-7.97072,31.62565],
        [-7.96955,31.62575],
        [-7.96958,31.62684],
        [-7.97120,31.62857],
        [-7.97210,31.63002],
        [-7.97321,31.63136],
        [-7.97395,31.63220],
        [-7.97480,31.63260],
        [-7.97660,31.63334],
        [-7.97795,31.63436],
        [-7.97802,31.63446],
        [-7.97805,31.63456],
        [-7.97848,31.63642],
        [-7.97925,31.63734],
        [-7.97985,31.63776],
        [-7.98033,31.63894],
        [-7.98137,31.63955],
        [-7.98163,31.63966],
        [-7.98286,31.64126],
        [-7.98308,31.64187],
        [-7.98362,31.64191],
        [-7.98462,31.64252],
        [-7.98628,31.64300],
        [-7.98699,31.64345],
        [-7.98737,31.64412],
        [-7.98720,31.64488],
        [-7.99203,31.64436],
        [-7.99281,31.64268],
        [-7.99516,31.63882],
        [-7.99767,31.63650],
        [-8.00091,31.63101],
        [-7.99961,31.62936],
        [-7.99980,31.62893],
        [-8.00239,31.62775], 
        [-7.99679,31.61731],
        [-7.99305,31.61775],
        [-7.99314,31.61863],
        [-7.99350,31.61929],
        [-7.99195,31.61953],
        [-7.99084,31.61742],
        [-7.98931,31.61073],
        [-7.98522,31.61166],
        [-7.98473,31.61213],
        [-7.98487,31.61286],
        [-7.98202,31.61346],
        [-7.98238,31.61453],
        [-7.97652,31.61584],
        [-7.97744,31.61927],
        [-7.97877,31.62193],
        [-7.97460,31.62394]
      ]
    ];

    // Add the Medina polygon as a source
    map.on('load', () => {
      map.addSource('medina', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: medinaCoordinates,
          },
        },
      });

      map.addLayer({
        id: 'medina-outline',
        type: 'line',
        source: 'medina',
        layout: {},
        paint: {
          'line-color': '#FBB040',
          'line-width': 2,
          'line-dasharray': [1, 1], // This makes the line appear dotted or dashed
        },
      });

      // Static routes
      getRoute([
        [-7.99312,31.62397], [-7.99216,31.62437], [-7.99206,31.62440], [-7.99196,31.62443], [-7.99175,31.62450], [-7.99184,31.62455], [-7.99154,31.62470], 
        [-7.99129,31.62479], [-7.99034,31.62509], [-7.98979,31.62528] ],
       'route1', '#BF6E51', 'Walking route between Koutoubia to Jemaa el Fna');
      getRoute([[-7.98952, 31.62597], [-7.98946,31.63066]], 'route2', '#BF6E51', 'Walking route between Jemaa el Fna to Le Jardin Secret');
      getRoute([[-7.98942,31.63085], [-7.98654,31.63202]], 'route3', '#BF6E51', 'Walking route between Le Jardin Secret to Madrasa Ben Youssef');
      getRoute([[-7.98644,31.63186], [-7.98689,31.62891]], 'route4', '#BF6E51', 'Walking route between Madrasa Ben Youssef to Rahba Lakdima');
      getRoute([[-7.98743,31.62874], [-7.98485,31.62328]], 'route5', '#BF6E51', 'Walking route between Rahba Lakdima to Dar Si Said Msm');
      getRoute([[-7.98479,31.62303], [-7.98414,31.62092]], 'route6', '#BF6E51', 'Walking route between Dar Si Said Msm to Bahia Palace');
      getRoute([[-7.98416,31.62077], [-7.98556,31.61900]], 'route7', '#BF6E51', 'Walking route between Bahia Palace to El Badi Palace');
      getRoute([
        [-7.98588,31.61893], [-7.98678,31.61871],[-7.98679,31.61869],[-7.98677,31.61862],[-7.98680,31.61856],[-7.98677,31.61846],[-7.98677,31.61844],
        [-7.98679,31.61843],[-7.98757,31.61830], [-7.98854,31.61814]], 
        'route8', '#BF6E51', 'Walking route between El Badi Palace to Saadian Tombs');
      getRoute([
        [-7.98916,31.61707], [-7.98954,31.61745], [-7.98958,31.61749], [-7.98973,31.61777], [-7.98971,31.61785], [-7.98967,31.61792], [-7.98960,31.61797], 
        [-7.98934,31.61810], [-7.98928,31.61816], [-7.98926,31.61824], [-7.98928,31.61834], [-7.98946,31.61892], [-7.98946,31.62178], [-7.98948,31.62199], 
        [-7.98967,31.62221], [-7.98975,31.62233], [-7.98982,31.62237], [-7.98988,31.62239], [-7.99000,31.62239], [-7.98994,31.62244], [-7.98980,31.62251], 
        [-7.98975,31.62254], [-7.98972,31.62257], [-7.98971,31.62262], [-7.98971,31.62269], [-7.98950,31.62327], [-7.98926,31.62396], [-7.98912,31.62440], 
        [-7.98907,31.62466], [-7.98890,31.62510], [-7.98904,31.62548]],
         'route9', '#BF6E51', 'Walking route between Saadian Tombs to Jemaa el Fna');
    });
 
    const getRoute = async (coordinates, routeId, color, title, description, buttonText) => {
      // Helper function to chunk coordinates into smaller arrays
      const chunkCoordinates = (coords, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < coords.length; i += chunkSize) {
          // Ensure overlapping endpoints for continuity between segments
          const chunk = coords.slice(i, i + chunkSize);
          if (i > 0) {
            chunk.unshift(coords[i - 1]); // Add the previous endpoint for continuity
          }
          chunks.push(chunk);
        }
        return chunks;
      };
    
      const waypointLimit = 25; // Adjust based on Mapbox plan
      const coordinateChunks = chunkCoordinates(coordinates, waypointLimit);
    
      // Combine all route geometries
      let combinedRoute = {
        type: 'LineString',
        coordinates: [],
      };
    
      try {
        for (const [index, chunk] of coordinateChunks.entries()) {
          const waypoints = chunk.map(coord => coord.join(',')).join(';');
          const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${waypoints}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
    
          // Merge the route geometry from each chunk
          const route = data.routes[0].geometry;
          combinedRoute.coordinates.push(...route.coordinates);
        }
    
        // Add the combined route source to the map
        map.addSource(routeId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: combinedRoute,
          },
        });
    
        // Add a shadow layer for a thicker background outline
        map.addLayer({
          id: `${routeId}-shadow-layer`,
          type: 'line',
          source: routeId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#333333', // Shadow color
            'line-width': 6.5,
            'line-opacity': 0.5,
          },
        });
    
        // Add the main route layer
        map.addLayer({
          id: `${routeId}-layer`,
          type: 'line',
          source: routeId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': color,
            'line-width': 4,
          },
        });
    
        // Add click event to the route layer to display a popup
        map.on('click', `${routeId}-layer`, (e) => {
          setPopupContent({
            title,
            description,
            buttonText,
            routeId,
          });
          setShowWelcomePopup(false);
        });
      } catch (error) {
        console.error('Error fetching or rendering route:', error);
      }
    };
    
      
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Array of marker data to handle multiple markers
    // const markersData = [
    //   {
    //     id: 1,
    //     coordinates: [-7.99365, 31.62386],
    //     imageSrc: '/historic-mon-icons/koutoubia.jpg',
    //     label: 'Koutoubia',
    //   },
    //   { 
    //     id: 2,
    //     coordinates: [-7.98931, 31.62570],
    //     imageSrc: '/historic-mon-icons/Place-Jemaa-El-Fna-Marrakech-tombée-de-la-Nuit.jpg',
    //     label: 'Jemaa el Fna',
    //   },
    //   {
    //     id: 3,
    //     coordinates: [-7.98973,31.63073],
    //     imageSrc: '/historic-mon-icons/le-jardin-secret.jpg',
    //     label: 'Le Jardin Secret',
    //   },
    //   {
    //     id: 4,
    //     coordinates: [-7.98624,31.63199],
    //     imageSrc: '/historic-mon-icons/ok-medersa-ben-youssef.jpg',
    //     label: 'Madrasa Ben Youssef',
    //   },
    //   {
    //     id: 5,
    //     coordinates: [-7.98718,31.62884],
    //     imageSrc: '/historic-mon-icons/Rahba+Kedima+Square.jpg',
    //     label: 'Rahba Lakdima',
    //   },
    //   {
    //     id: 6,
    //     coordinates: [-7.98427,31.62336],
    //     imageSrc: '/historic-mon-icons/The-Museum-Dar-Si-Said-Marrakech-design.jpg',
    //     label: 'Dar Si Said Msm',
    //   },
    //   {
    //     id: 7,
    //     coordinates: [-7.98367,31.62087],
    //     imageSrc: '/historic-mon-icons/bahia-palace.jpg',
    //     label: 'Bahia Palace',
    //   },
    //   {
    //     id: 8,
    //     coordinates: [-7.98563,31.61853],
    //     imageSrc: '/historic-mon-icons/History-of-El-Badi-Palace-2.jpg',
    //     label: 'El Badi Palace',
    //   },
    //   {
    //     id: 9,
    //     coordinates: [-7.98884,31.61719],
    //     imageSrc: '/historic-mon-icons/saadian-tombs.jpg',
    //     label: 'Saadian Tombs',
    //   },
    //   {
    //     id: 10,
    //     coordinates: [-7.99083,31.62649],
    //     imageSrc: '/artisanat-souk/category-1.jpeg',
    //     label: 'Souk jef 1',
    //   },
    // ];

    // Function to create and adjust markers based on zoom level
    const createMarkers = () => {
      spots.forEach((spot) => {
        // Create the custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';

        // Create the image element
        const markerImage = document.createElement('img');
        markerImage.src = spot.imageUrl;
        markerImage.alt = spot.name;
        markerElement.appendChild(markerImage);

        // Create the label element
        const markerLabel = document.createElement('div');
        markerLabel.className = 'marker-label';
        markerLabel.innerText = spot.name;
        markerElement.appendChild(markerLabel);

        // Add the marker to the map
        new mapboxgl.Marker(markerElement)
          .setLngLat(spot.coordinates)
          .addTo(map)
          .getElement().addEventListener('click', () => {
            setSelectedSpotId(spot.id);
            setShowCardContainer(true);
          });  
        // Store marker elements for dynamic resizing on zoom
        spot.element = markerElement;
        spot.image = markerImage;
        spot.label = markerLabel;
      });
    };

    // Adjust marker size and label based on zoom level
    const adjustMarkersOnZoom = () => {
      const zoomLevel = map.getZoom();
      const imageSize = 30 + (zoomLevel - 13) * 15; // Adjust size dynamically
      const fontSize = 4 + (zoomLevel - 13) * 2; // Increase label font size with zoom

      spots.forEach((spot) => {
        // Adjust image size
        spot.image.style.width = `${Math.max(15, imageSize)}px`;
        spot.image.style.height = `${Math.max(15, imageSize)}px`;

        // Adjust label font size
        spot.label.style.fontSize = `${fontSize}px`;
      });
    };

    // Call functions initially and on zoom events
    createMarkers();
    adjustMarkersOnZoom();
    map.on('zoom', adjustMarkersOnZoom);
    // // Define the Jemaa el Fna location
    // const jemaaElFnaCoordinates = [-7.98931,31.62570];

    // // Create the marker element
    // const markerElement = document.createElement('div');
    // markerElement.className = 'custom-marker';

    // // Create the image inside the marker
    // const markerImage = document.createElement('img');
    // markerImage.src = '/Place-Jemaa-El-Fna-Marrakech-tombée-de-la-Nuit.jpg'; // Replace with the actual image path or URL
    // markerImage.alt = 'Jemaa el Fna';
    // markerElement.appendChild(markerImage);

    // // Create the label below the marker
    // const markerLabel = document.createElement('div');
    // markerLabel.className = 'marker-label';
    // markerLabel.innerText = 'Jemaa el Fna';
    // markerElement.appendChild(markerLabel);

    // // Add the custom marker to the map
    // new mapboxgl.Marker(markerElement)
    //   .setLngLat(jemaaElFnaCoordinates)
    //   .addTo(map);

    //return () => map.remove();
  }, [spots]);

  // Handle click outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupContent(null); // Hide route popup
        setShowWelcomePopup(true); // Show welcome popup again
        setShowCardContainer(false); // Hide card container
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll to selected card based on selectedSpotId
  useEffect(() => {
    if (selectedSpotId !== null && cardContainerRef.current) {
      const cardElement = cardContainerRef.current.querySelector(`[data-id='${selectedSpotId}']`);
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedSpotId, showCardContainer]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="map-page">
      <div ref={mapContainerRef} className="map-container" />

        {showWelcomePopup && (
            <div className="welcome-popup">
                <div className="popup-header">
                    <h3>Where are you going?</h3>
                    <div className="header-controls">
                        {/* <Form.Select 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="type-selector me-3"
                        >
                            <option value="spots">Spots</option>
                            <option value="souks">Souks</option>
                        </Form.Select> */}
                        <FontAwesomeIcon
                            icon={showCardContainer ? faAngleUp : faAngleDown}
                            className="popup-icon"
                            onClick={() => setShowCardContainer(!showCardContainer)}
                        />
                    </div>
                </div>
                <p className="popup-listT">
                    List of best {selectedType === 'spots' ? 'Spots' : 'Souks'} in Marrakech
                </p>
                <div
                    ref={cardContainerRef}
                    className={`card-containerX ${showCardContainer ? 'slide-down' : 'slide-up'}`}
                >
                  {getCurrentItems().map((item) => (
                    <Card key={item.id} className="scroll-card" data-id={item.id}>
                        <Card.Img variant="top" src={item.imageUrl} alt={item.name} />
                        <div className="info-btn">
                            <Card.Body className="card-info">
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                {selectedType === 'souks' && (
                                    <Card.Text className="theme-text">
                                        Theme: {item.theme}
                                    </Card.Text>
                                )}
                            </Card.Body>
                            <Button 
                                variant={item.videoUrl ? "primary" : "secondary"}
                                className={`card-btn ${!item.videoUrl ? 'disabled-btn' : ''}`}
                                onClick={() => handleStartClick(item)}
                                disabled={!item.videoUrl}
                            >
                                {item.videoUrl ? 'Start' : 'Coming Soon'}
                            </Button>
                        </div>
                    </Card>
                  ))}
              </div>
          </div>
        )}

      {popupContent && (
        <div ref={popupRef} className="map-popup">
          <h3>{popupContent.title}</h3>
          <p>{popupContent.description}</p>
          {/* <button onClick={() => handleButtonClick(popupContent.routeId)}>
            {popupContent.buttonText}
          </button> */}
        </div>
      )}
    </div>
  );
};

export default MapPage;
