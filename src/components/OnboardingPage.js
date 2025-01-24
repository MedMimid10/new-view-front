import React from 'react';
import './OnboardingPage.css'; 
import imgTourist from './assets/newView-Icon.png';
import roadImg from './assets/road-img.png';
import cercleM from './assets/cercle-meter.png';

function OnboardingPage() {
  return (
    <div className="onboarding-container">
        <div className="onboarding-content">
            <img src={imgTourist} alt="Tourist-icon" className="nv-image" />
            <span className='title-p'>New View</span>
            <span className='title-s'>Your VR Guide</span>
            <span className='title-s'>Navigation</span>
        </div>
        <img src={cercleM} alt="cercleM-img" className="cercleM-image" />
        <img src={roadImg} alt="road-img" className="road-image" />
    </div>
  );
}

export default OnboardingPage;
