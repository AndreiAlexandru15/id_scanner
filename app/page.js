"use client";
import React, { useState } from "react";
import Tesseract from "tesseract.js";

const Home = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState(""); // Stocăm textul complet extras
  const [isProcessing, setIsProcessing] = useState(false);

  // Funcția pentru a încărca imaginea
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Funcția pentru procesarea imaginii și extragerea textului
  const processImage = async () => {
    if (!image) return;
    setIsProcessing(true);

    try {
      // Procesăm imaginea folosind Tesseract
      const result = await Tesseract.recognize(image, "ron", {
        logger: (info) => console.log(info),
      });

      // Setăm textul complet extras
      setExtractedText(result.data.text);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">ID Scanner</h1>

      {/* Input pentru a încărca imaginea */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      />

      {image && (
        <div className="flex flex-col items-center">
          <img src={image} alt="Uploaded" className="w-full max-w-md rounded-lg shadow-lg" />

          <button
            onClick={processImage}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Process Image"}
          </button>
        </div>
      )}

      {extractedText && (
        <div className="mt-6 bg-white p-4 rounded shadow-md max-w-md w-full">
          <h2 className="text-lg font-semibold">Extracted Text:</h2>
          <p className="mt-2 whitespace-pre-wrap">{extractedText}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
