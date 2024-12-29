"use client"
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

const Home = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const captureImage = () => {
    if (webcamRef.current) {
      const capturedImage = webcamRef.current.getScreenshot();
      setImage(capturedImage);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (info) => console.log(info),
      });
      setText(result.data.text);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">ID Scanner</h1>
      {!image ? (
        <div className="flex flex-col items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
          <button
            onClick={captureImage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Capture Image
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img src={image} alt="Captured" className="w-full max-w-md rounded-lg shadow-lg" />
          <button
            onClick={processImage}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Image'}
          </button>
          <button
            onClick={() => setImage(null)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retake
          </button>
        </div>
      )}
      {text && (
        <div className="mt-6 bg-white p-4 rounded shadow-md max-w-md w-full">
          <h2 className="text-lg font-semibold">Extracted Text:</h2>
          <p className="mt-2">{text}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
