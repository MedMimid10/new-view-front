import React, { useEffect, useRef, useState } from 'react';
// import { Image } from 'react-bootstrap';
import { Html, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward, faPause, faPlay, faVolumeMute, faVolumeUp, faArrowLeft, faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import * as THREE from 'three';
import { storeService } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import './VideoPlayer.css';


function VideoPlayer() {
  const videoRef = useRef(null);
  const popupRef = useRef(null);
  const [videoTexture, setVideoTexture] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [showHotspot, setShowHotspot] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [zPosition, setZPosition] = useState(-130);
  const [hotspotTexture, setHotspotTexture] = useState(null);
  const [hotspotTexture2, setHotspotTexture2] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();
  const videoUrl = location.state?.videoUrl;
  const spotType = location.state?.type;

  const [stores, setStores] = useState([]);
  const [storeProducts, setStoreProducts] = useState({});
  const [loadingStores, setLoadingStores] = useState(true);
  const [error, setError] = useState(null);

  const fetchStoreData = async (storeIds) => {
    try {
        setLoadingStores(true);
        const storesData = await Promise.all(
            storeIds.map(id => storeService.getStoreDetails(id))
        );
        setStores(storesData);

        // Fetch products for each store
        const productsData = {};
        await Promise.all(
            storeIds.map(async (id) => {
                const products = await storeService.getStoreProducts(id);
                productsData[id] = products;
            })
        );
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
    const loader = new THREE.TextureLoader();
  
    // Find the store with id = 1
    const storeWithId1 = stores.find(store => store.id === 1);
  
    if (storeWithId1?.profileImageUrl) {
      const customTexture = createHotspotTexture(
        storeWithId1.profileImageUrl,
        storeWithId1.name || 'Default Store'
      );
      setHotspotTexture(customTexture);
    }
    
    const video = videoRef.current;
    let animationFrameId;
    let targetZPosition = -130;
    let currentZPosition = -130;
    let isAnimating = false;
  
    const updatePositions = () => {
      currentZPosition += (targetZPosition - currentZPosition) * 0.03;
      setZPosition(currentZPosition);
  
      if (Math.abs(targetZPosition - currentZPosition) > 0.01) {
        animationFrameId = requestAnimationFrame(updatePositions);
      } else {
        isAnimating = false;
      }
    };
  
    if (video) {
      video.src = videoUrl;
      const texture = new THREE.VideoTexture(video);
      setVideoTexture(texture);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
  
      video.onloadedmetadata = () => {
        setDuration(video.duration);
      };
  
      video.ontimeupdate = () => {
        const currentTime = video.currentTime;
        setCurrentTime(currentTime);
  
        if (currentTime >= 6 && currentTime <= 16) {
          targetZPosition = -130 + (currentTime - 6) * 15;
          setShowHotspot(true);
  
          if (!isAnimating) {
            isAnimating = true;
            cancelAnimationFrame(animationFrameId);
            updatePositions();
          }
        } else {
          setShowHotspot(false);
          setIsPopupVisible(false);
          targetZPosition = -130;
  
          if (!isAnimating) {
            isAnimating = true;
            cancelAnimationFrame(animationFrameId);
            updatePositions();
          }
        }
      };
    }
  
    return () => {
      cancelAnimationFrame(animationFrameId);
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
  
  // Handle hotspot click
  const handleClickHotspot = (event, sellerId) => {
    event.stopPropagation();
    setCurrentSellerId(sellerId);
    setIsPopupVisible(true);
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
  }, [isPopupVisible]);

  return (
    <div className="video-container">
      <Canvas className="canvas" style={{ pointerEvents: isPopupVisible ? 'none' : 'auto' }}>
        <ambientLight intensity={0.5} />
        <OrbitControls
          enableDamping={true}
          rotateSpeed={1}
          minDistance={50}
          maxDistance={50}
          enabled={!isPopupVisible}
        />

        {videoTexture && (
          <mesh scale={[-1, 1, 1]} rotation={[0, 300, 0]}>
            <sphereGeometry args={[150, 64, 64]} />
            <meshBasicMaterial side={THREE.DoubleSide} map={videoTexture} />
          </mesh>
        )}

        {showHotspot && (
        <>
            {/* Existing hotspot for hamidStore */}
            <mesh
              position={[60, 0, zPosition]}
              onClick={(event) => handleClickHotspot(event, 1)}
              scale={[5, 5, 1]}
              rotation={[0, 5, 0]}
              className="hotspot"
            >
              <planeGeometry args={[8, 3.5]} />
              <meshBasicMaterial map={hotspotTexture} transparent={true} />
            </mesh>
          </>
        )}

        <Html fullscreen>
        {/* New Souk Info Card */}
        <button class="back-buttonV" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft}/>
        </button>
        <div className="souk-info-card">
            <div className="souk-info-container">
              <div className="info-item">
                <div className="icon">
                <FontAwesomeIcon icon={faAnglesLeft} />
                </div>
                <span className="info-text">15 Stores</span>
              </div>
              
              <div className="souk-name">
                <h2>Souk Al Mubarakiya</h2>
              </div>
              
              <div className="info-item">
                <span className="info-text">8 Stores</span>
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
        </Html>
      </Canvas>

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

      <video ref={videoRef} style={{ display: 'none' }} src={videoUrl} loop crossOrigin="anonymous" />
      {/* <video ref={videoRef} style={{ display: 'none' }} src="D:/video360/VID_20250110_191328_00_042.mp4" loop crossOrigin="anonymous" /> */}
    </div>
  );
}

export default VideoPlayer;