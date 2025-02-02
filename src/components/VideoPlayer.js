import React, { useEffect, useRef, useState } from 'react';
// import { Image } from 'react-bootstrap';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward, faPause, faPlay, faVolumeMute, faVolumeUp, faArrowLeft, faAnglesRight, faAnglesLeft, faCartShopping, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import * as THREE from 'three';
import { storeService, spotService, soukService, cartServiceV } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import './VideoPlayer.css';
import CartPopup from './CartPopup';
import { ToastContainer } from 'react-toastify';

function VideoPlayer() {
  const videoRef = useRef(null);
  const popupRef = useRef(null);
  const [videoTexture, setVideoTexture] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [stores, setStores] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [leftStoresCount, setLeftStoresCount] = useState(0);
  const [rightStoresCount, setRightStoresCount] = useState(0);
  const [storeProducts, setStoreProducts] = useState({});
  const [hotspotTextures, setHotspotTextures] = useState({});
  const [visibleHotspots, setVisibleHotspots] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const cartRef = useRef(null);
  const [loadingStores, setLoadingStores] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const S3_URL = 'https://fsn1.your-objectstorage.com/videosmarrakerch/'

  const location = useLocation();
  let { videoUrl, autoplay } = location.state;
  videoUrl = S3_URL + videoUrl;
  const spotType = location.state?.type;

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


  const fetchStoreData = async (storeIds) => {
    try {
      setLoadingStores(true);
      
      // Use existing getStoreDetails method
      const storesData = await Promise.all(
        storeIds.map(id => storeService.getStoreDetails(id))
      );

      // Get the first store to determine if it's a souk or spot
      const firstStore = storesData[0];
      let locationInfo;
      
      if (firstStore?.soukId) {
        locationInfo = await soukService.getSoukById(firstStore.soukId);
        setLocationName(locationInfo.name);
      } else if (firstStore?.spotId) {
        locationInfo = await spotService.getSpotById(firstStore.spotId);
        setLocationName(locationInfo.name);
      }

      // Count stores on each side
      const leftCount = storesData.filter(store => store.side === 'left').length;
      const rightCount = storesData.filter(store => store.side === 'right').length;
      
      setLeftStoresCount(leftCount);
      setRightStoresCount(rightCount);

      // Create hotspot textures for each store
      const textures = {};
      storesData.forEach((store, index) => {
        textures[store.id] = createHotspotTexture(
          store.profileImageUrl,
          store.name
        );
      });
      setHotspotTextures(textures);

      // Fetch products for each store
      const productsData = {};
      await Promise.all(
        storeIds.map(async (id) => {
          const products = await storeService.getStoreProducts(id);
          productsData[id] = products;
        })
      );

      const processedStores = storesData.map(store => ({
        ...store,
        position: store.side === 'right' 
          ? [60, 0, -180]   
          : [-60, 0, -180], 
        rotation: store.side === 'right'
          ? [0, 5, 0]       
          : [0, -5, 0]
      }));

      setStores(processedStores);
      setStoreProducts(productsData);
      setLoadingStores(false);
    } catch (err) {
      console.error('Error fetching store data:', err);
      setError(err.message);
      setLoadingStores(false);
    }
  };

  useEffect(() => {
    const storeIds = [1, 2]; 
    fetchStoreData(storeIds);
  }, []);

  const [currentSellerId, setCurrentSellerId] = useState(null);
  const currentSeller = stores.find(store => store.id === currentSellerId);
  const currentSellerProducts = storeProducts[currentSellerId] || [];

  const createHotspotTexture = (profileImageUrl, name) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    // Set canvas size to match the 8x4 ratio
    canvas.width = 256;  // Adjust according to your desired resolution
    canvas.height = 128; // Adjust to match your 8:4 aspect ratio
  
    // Draw rounded rectangle with grey outline
    const drawRoundedRect = (ctx, x, y, width, height, radius, fillColor, borderColor) => {
      // Outer rounded rectangle for the border
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
  
      // Fill the border
      ctx.fillStyle = borderColor;
      ctx.fill();
  
      // Inner rounded rectangle for the white background
      const borderWidth = 6; // Thickness of the border
      ctx.beginPath();
      ctx.moveTo(x + radius + borderWidth, y + borderWidth);
      ctx.lineTo(x + width - radius - borderWidth, y + borderWidth);
      ctx.quadraticCurveTo(x + width - borderWidth, y + borderWidth, x + width - borderWidth, y + radius + borderWidth);
      ctx.lineTo(x + width - borderWidth, y + height - radius - borderWidth);
      ctx.quadraticCurveTo(x + width - borderWidth, y + height - borderWidth, x + width - radius - borderWidth, y + height - borderWidth);
      ctx.lineTo(x + radius + borderWidth, y + height - borderWidth);
      ctx.quadraticCurveTo(x + borderWidth, y + height - borderWidth, x + borderWidth, y + height - radius - borderWidth);
      ctx.lineTo(x + borderWidth, y + radius + borderWidth);
      ctx.quadraticCurveTo(x + borderWidth, y + borderWidth, x + radius + borderWidth, y + borderWidth);
      ctx.closePath();
  
      // Fill the inner area
      ctx.fillStyle = fillColor;
      ctx.fill();
    };
  
    drawRoundedRect(context, 0, 0, canvas.width, canvas.height, 15, 'white', 'grey');
  
    // Draw the profile image inside a circle on the left side
    const image = new Image();
    image.src = profileImageUrl;
    image.onload = () => {
      const imageX = 14;  // Left side offset
      const centerY = canvas.height / 2;
      const radius = 32;
  
      context.save();
      context.beginPath();
      context.arc(imageX + radius, centerY, radius, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();
  
      // Draw the clipped image
      context.drawImage(image, imageX, centerY - radius, radius * 2, radius * 2);
      context.restore();
  
      // Add store name text on the right side of the profile image
      context.font = 'bold 18px "Montserrat", sans-serif';
      context.fillStyle = 'black';
      context.textAlign = 'left';
      context.fillText(name, imageX + 70, canvas.height / 2 + 5); // Adjust the X and Y positions as necessary
  
      // Update the texture
      texture.needsUpdate = true;
    };
  
    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
};
  
useEffect(() => {
  const video = videoRef.current;
  let animationFrameId;
  const animationState = new Map(); // Track animation state for each store
  
  if (video && videoUrl) {
    
    video.src = videoUrl;
    // Setup video only after source is set
    if (autoplay) {
      video.play().catch(error => {
        console.error('Autoplay failed:', error);
      });
    }
    const texture = new THREE.VideoTexture(video);
    setVideoTexture(texture);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.colorSpace = THREE.SRGBColorSpace;

    // Event listeners with proper function references for cleanup
    const preventDefaultTouch = (e) => e.preventDefault();
    const preventDefaultClick = (e) => e.preventDefault();

    video.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    video.addEventListener('click', preventDefaultClick);

    video.onloadedmetadata = () => {
      setDuration(video.duration);
    };

    // Smooth animation function
    const animate = () => {
      const currentTime = video.currentTime;
      setCurrentTime(currentTime);

      // Get stores that should be visible
      const visibleStores = stores.filter(store => 
        currentTime >= store.startTime && 
        currentTime <= store.endTime
      );

      // Update position for each visible store with smooth animation
      const updatedStores = visibleStores.map(store => {
        const targetZ = -180 + (currentTime - store.startTime) * 25;
        // Initialize or get current animation state
        if (!animationState.has(store.id)) {
          animationState.set(store.id, {
            currentZ: -180,
            velocity: 0
          });
        }
        
        const state = animationState.get(store.id);
        
        // Spring animation parameters
        const springStrength = 0.3; // Adjust for more/less springiness
        const damping = 0.75; // Adjust for more/less smoothing
        
        // Calculate spring physics
        const distance = targetZ - state.currentZ;
        const acceleration = distance * springStrength;
        state.velocity = state.velocity * damping + acceleration;
        state.currentZ += state.velocity;

        return {
          ...store,
          position: [
            store.position[0],
            store.position[1],
            state.currentZ
          ]
        };
      });

      // Clean up animation states for non-visible stores
      for (const [storeId] of animationState) {
        if (!visibleStores.some(store => store.id === storeId)) {
          animationState.delete(storeId);
        }
      }

      setVisibleHotspots(updatedStores);
      
      // Hide popup if no hotspots are visible
      if (updatedStores.length === 0) {
        setIsPopupVisible(false);
      }

      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };

    //Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    video.ontimeupdate = () => {
      // Keep this for time tracking, but position updates happen in animation loop
      setCurrentTime(video.currentTime);
    };
  }

  return () => {
    video.removeEventListener('touchstart', (e) => {
      e.preventDefault();
    });
    video.removeEventListener('click', (e) => {
      e.preventDefault();
    });
    
    if (video) {
      video.ontimeupdate = null;
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}, [videoUrl, stores]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.warn('Play failed:', err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const handleMuteUnmute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
    } else {
      video.volume = 0;
    }
    setIsMuted(!isMuted);
  };
  
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    const video = videoRef.current;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  
  const handlePlaybackRateChange = () => {
    const newRate = (playbackRate + 0.5) % 2.5 || 0.5;
    const video = videoRef.current;
    video.playbackRate = newRate;
    setPlaybackRate(newRate);
  };
  
  const skipForward = () => {
    const video = videoRef.current;
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  };
  
  const skipBackward = () => {
    const video = videoRef.current;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };
  
  const disableControls = () => {
    setControlsEnabled(false);
  };
  
  const enableControls = () => {
    setControlsEnabled(true);
  };
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  const handleContainerClick = (event) => {
    // Check if the click is on the Three.js canvas or other UI elements
    if (
      event.target.closest('.video-controls') || 
      event.target.closest('.popup') ||
      event.target.closest('.back-buttonV') ||
      event.target.closest('.cart-buttonV') ||
      event.target.closest('.souk-info-card')
    ) {
      return;
    }
    
    handlePlayPause();
  };
  
  // Handle hotspot click
  const handleClickHotspot = (event, sellerId) => {
    // Stop the Three.js event from propagating
    event.stopPropagation();
    
    // Ensure the video container click won't be triggered
    setTimeout(() => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      
      setCurrentSellerId(sellerId);
      setIsPopupVisible(true);
    }, 0);
  };

  // Handle click outside the popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isPopupVisible && popupRef.current && !popupRef.current.contains(e.target)) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside); // Cleanup
  }, [isPopupVisible], [isCartVisible]);

  return (
    <div className="video-container" onClick={handleContainerClick}>
      <Canvas className="canvas" style={{ pointerEvents: isPopupVisible ? 'none' : 'auto' }}
      gl= {{ outputColorSpace: THREE.SRGBColorSpace, toneMapping: THREE.ACESFilmicToneMapping }}>
        <ambientLight intensity={0.5} />
        <OrbitControls
          enableDamping={true}
          rotateSpeed={1}
          minDistance={50}
          maxDistance={50}
          enabled={!isPopupVisible}
          enableZoom={false}          
          enablePan={false}             
          dampingFactor={0.1}
        />

        {videoTexture && (
          <mesh scale={[-1, 1, 1]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[150, 64, 64]} />
            <meshBasicMaterial side={THREE.DoubleSide} map={videoTexture} />
          </mesh>
        )}

        {/* Render all visible hotspots */}
        {visibleHotspots.map(store => (
          <mesh
            key={store.id}
            position={store.position}
            onClick={(event) => handleClickHotspot(event, store.id)}
            scale={[5, 5, 1]}
            rotation={store.rotation}
            className="hotspot"
          >
            <planeGeometry args={[8, 3.5]} />
            <meshBasicMaterial 
              map={hotspotTextures[store.id]} 
              transparent={true} 
            />
          </mesh>
        ))}

      </Canvas>
      {/* New Souk Info Card */}
      <button class="back-buttonV" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft}/>
      </button>

      {/* New cart button */}
      <button 
        className="cart-buttonV" 
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

      <div className="souk-info-card">
        <div className="souk-info-container">
          <div className="info-item">
            <div className="icon">
              <FontAwesomeIcon icon={faAnglesLeft} />
            </div>
            <span className="info-text">{leftStoresCount} Stores</span>
          </div>
          
          <div className="souk-name">
            <h2>{locationName || 'Loading...'}</h2>
          </div>
          
          <div className="info-item">
            <span className="info-text">{rightStoresCount} Stores</span>
            <div className="icon">
              <FontAwesomeIcon icon={faAnglesRight} />
            </div>
          </div>
        </div>
      </div>

      <div className="video-controls">
        {/* First Row */}
        <div className="video-row-1">
          <div className="volume-container">
            <div className="volume-wrapper">
              <button onClick={handleMuteUnmute} className="button circular">
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
              </button>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={isMuted ? 0 : volume}
                onMouseDown={disableControls}
                onMouseUp={enableControls}
                onChange={handleVolumeChange}
                className="volume-control"
              />
            </div>
          </div>
          <div className="progress-container">
            <span className="time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              step="0.1"
              onMouseDown={disableControls}
              onMouseUp={enableControls}
              onChange={handleSeek}
              className="seek-bar"
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
          <div className="speed-control">
            <button onClick={handlePlaybackRateChange} className="button circular">
              <span>{playbackRate}x</span>
            </button>
          </div>
        </div>

        {/* Second Row */}
        <div className="video-row-2">
          <button onClick={skipBackward} className="button skip-button">
            <FontAwesomeIcon icon={faBackward} /> <span>10s</span>
          </button>
          <button onClick={handlePlayPause} className="button circular play-button">
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button onClick={skipForward} className="button skip-button">
            <FontAwesomeIcon icon={faForward} /> <span>10s</span>
          </button>
        </div>
      </div>

      {/* Fixed Popup */}
      {isPopupVisible && currentSeller && (
      <div className="popup" ref={popupRef}>
        <div className="popup-header">
            <div className="profile-section">
                <img 
                    src={currentSeller.profileImageUrl} 
                    alt={currentSeller.name} 
                    className="profile-image"
                />
                <span className="username">{currentSeller.name}</span>
            </div>
            <div className="button-section">
                <button
                    className="view-store-button"
                    onClick={() => navigate(`/seller/${currentSeller.id}`)}
                >
                    View Store
                </button>
            </div>
        </div>
        <div className="popup-content">
            <div className="items-title">
                <h3>Store Items</h3>
                <span>Show more</span>
            </div>
            <div className="image-store mt-2">
                {currentSellerProducts.map((product) => (
                    <div key={product.id} className="image-item">
                        <img 
                            src={product.imageUrl} 
                            className="image-style" 
                            alt={product.name} 
                        />
                        <p className="title-item">{product.name}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
      )}

      <video ref={videoRef} style={{ display: 'none' }} src={videoUrl} loop crossOrigin="anonymous" playsInline webkit-playsinline="true"
        x5-playsinline="true" preload="auto" controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture disableRemotePlayback/>
      {/* <video ref={videoRef} style={{ display: 'none' }} src="D:/video360/VID_20250110_191328_00_042.mp4" loop crossOrigin="anonymous" /> */}
    </div>
  );
}

export default VideoPlayer;