"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const Home = () => {
  const webcamRef = useRef(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(true); // State to track camera direction

  const videoConstraints = {
    facingMode: isBackCamera ? "environment" : "user", // Switch between 'environment' and 'user'
  };

  const processFrame = async (imageSrc) => {
    if (isProcessing) return; // Skip if already processing
    setIsProcessing(true);

    try {
      const result = await Tesseract.recognize(imageSrc, "ron", {
        logger: (info) => console.log(info),
      });
      setText(result.data.text);
    } catch (error) {
      console.error("Error processing frame:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const captureFrame = () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      processFrame(imageSrc); // Send the captured frame for processing
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame(); // Capture frames every 1 second
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [isBackCamera]); // Re-run if the camera direction changes

  const toggleCamera = () => {
    setIsBackCamera((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Live ID Scanner</h1>
      <div className="flex flex-col items-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full max-w-md rounded-lg shadow-lg"
        />
        <div className="mt-4 flex gap-4">
          <button
            onClick={toggleCamera}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Switch Camera
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white p-4 rounded shadow-md max-w-md w-full">
        <h2 className="text-lg font-semibold">Live Extracted Text:</h2>
        <p className="mt-2 whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
};

export default Home;
