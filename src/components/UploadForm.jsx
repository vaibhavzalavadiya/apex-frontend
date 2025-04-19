import React, { useState, useEffect } from 'react';
import './UploadForm.css';

const UploadForm = ({ setResultImage, setIsLoading }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }
    
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewURL(preview);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setIsLoading(true);
      setIsSubmitting(true);

      // Use fetch API for the request
      const response = await fetch("http://127.0.0.1:8000/api/remove-background/", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();

      if (data && data.image) {
        setResultImage({
          image: data.image,
          filename: data.filename || 'bg-removed.png',
        });
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Background removal failed. Please try again.');
      setResultImage(null);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow upload-card animate__animated animate__fadeIn">
      <div className="card-body p-4">
        <div className="text-center mb-4">
          <h2 className="card-title fw-bold gradient-text">AI Background Remover</h2>
          <p className="text-muted">Professional-quality background removal in seconds</p>
        </div>
        
        <form onSubmit={handleSubmit} onDragEnter={handleDrag}>
          <div 
            className={`upload-area rounded ${dragActive ? 'drag-active' : ''} ${previewURL ? 'has-preview' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!previewURL ? (
              <div className="upload-placeholder text-center">
                <i className="bi bi-cloud-arrow-up-fill upload-icon mb-3"></i>
                <p>Drag & drop your image here</p>
                <p className="or-divider">or</p>
                <label className="btn btn-primary px-4">
                  Browse files
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
                <p className="text-muted small mt-3">Supports JPG, PNG, WebP (max 5MB)</p>
              </div>
            ) : (
              <div className="preview-container text-center w-100">
                <div className="preview-image mb-3">
                <img src={previewURL} alt="Preview" className="rounded w-100 h-100" />
                </div>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setPreviewURL(null);
                    setImageFile(null);
                  }}
                >
                  Change image
                </button>
              </div>
            )}
          </div>

          <div className="d-grid mt-4">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={!imageFile || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-magic me-2"></i>
                  Remove Background
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;