import React, { useState, useEffect } from 'react';
import './Result.css';

const ResultImage = ({ resultImage, onReset }) => {
  const [showContent, setShowContent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  useEffect(() => {
    if (resultImage) {
      setTimeout(() => setShowContent(true), 300);
    } else {
      setShowContent(false);
    }
  }, [resultImage]);
  
  if (!resultImage) return null;
  
  const { image, filename } = resultImage;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image}`;
    link.download = filename || "bg-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show download confirmation toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleShare = async () => {
    try {
      // Convert base64 to blob
      const response = await fetch(`data:image/png;base64,${image}`);
      const blob = await response.blob();
      
      // Try to use Web Share API
      if (navigator.share) {
        await navigator.share({
          files: [new File([blob], filename || 'bg-removed.png', { type: 'image/png' })],
          title: 'Image with removed background'
        });
      } else {
        alert('Sharing is not supported on this browser');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <div className={`card shadow result-card ${showContent ? 'show' : ''}`}>
      <div className="card-body p-4">
        <div className="text-center mb-4">
          <h3 className="text-success fw-bold">Background Removed!</h3>
          <p className="text-muted">Your image is ready to download</p>
        </div>
        
        <div className="result-image-container text-center mb-4">
          <div className="checkerboard-bg d-inline-block p-3 rounded w-100">
            <div className="processed-image">
            <img
              src={`data:image/png;base64,${image}`}
              alt="Processed"
              className="w-100 h-100"
            />
          </div>
          </div>
        </div>
        
        <div className="row g-2 mb-4">
          <div className="col">
            <button 
              className="btn btn-success w-100"
              onClick={handleDownload}>
              <i className="bi bi-download me-2"></i>
              Download
            </button>
          </div>
          <div className="col">
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={handleShare}>
              <i className="bi bi-share me-2"></i>
              Share
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <button className="btn btn-link" onClick={onReset}>
            <i className="bi bi-arrow-left me-1"></i>
            Remove another image
          </button>
        </div>
      </div>
      
      {showToast && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x p-3">
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-body">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              Download started
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultImage;