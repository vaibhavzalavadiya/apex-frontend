import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import ResultImage from './components/ResultImage';
import './App.css';

const App = () => {
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleReset = () => {
    setResultImage(null);
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {!resultImage && (
            <UploadForm 
              setResultImage={setResultImage} 
              setIsLoading={setIsLoading} 
            />
          )}
          
          {resultImage && (
            <ResultImage 
              resultImage={resultImage} 
              onReset={handleReset} 
            />
          )}
        </div>
      </div>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="card shadow p-4 text-center">
            <div className="spinner-border text-primary mx-auto mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="mb-2">Removing background...</h5>
            <p className="text-muted">This may take a few seconds</p>
          </div>
        </div>
      )}
      
      <footer className="text-center mt-5">
          <p className="text-muted small">
            © 2025 AI Background Remover • <a href="#" className="text-decoration-none">Privacy Policy</a> • <a href="#" className="text-decoration-none">Terms of Service</a>
          </p>
      </footer>
    </div>
  );
};

export default App;