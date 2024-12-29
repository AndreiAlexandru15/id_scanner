"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const Home = () => {
  const webcamRef = useRef(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [documentData, setDocumentData] = useState(null); // To store parsed data

  const videoConstraints = {
    facingMode: isBackCamera ? "environment" : "user",
  };

  // Function to extract relevant fields from the text
  const extractDocumentData = (text) => {
    const regex = {
      cnp: /\b\d{13}\b/, // CNP is a 13-digit number
      serie: /\b[A-Z]{2}\d{6}\b/, // Series is two letters followed by six digits
      nume: /(Nume:\s*([A-Za-z]+))/i, // Assuming "Nume" appears in the text
      prenume: /(Prenume:\s*([A-Za-z]+))/i, // Assuming "Prenume" appears in the text
      domiciliu: /(Domiciliu:\s*([A-Za-z\s]+))/i, // Assuming "Domiciliu" appears in the text
      dataEliberare: /(Eliberat la:\s*(\d{2}\/\d{2}\/\d{4}))/i, // Date format dd/mm/yyyy
    };

    const data = {};
    data.cnp = text.match(regex.cnp)?.[0] || null;
    data.serie = text.match(regex.serie)?.[0] || null;
    data.nume = text.match(regex.nume)?.[2] || null;
    data.prenume = text.match(regex.prenume)?.[2] || null;
    data.domiciliu = text.match(regex.domiciliu)?.[2] || null;
    data.dataEliberare = text.match(regex.dataEliberare)?.[2] || null;

    return data;
  };

  const processFrame = async (imageSrc) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const result = await Tesseract.recognize(imageSrc, "ron", {
        logger: (info) => console.log(info),
      });

      setText(result.data.text);
      const parsedData = extractDocumentData(result.data.text);
      setDocumentData(parsedData); // Store parsed document data
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
  }, [isBackCamera]);

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
      {documentData && (
        <div className="mt-6 bg-white p-4 rounded shadow-md max-w-md w-full">
          <h2 className="text-lg font-semibold">Document Data:</h2>
          <ul className="mt-2">
            {Object.entries(documentData).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value || "Not found"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
