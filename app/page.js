"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [cnp, setCnp] = useState('');
  const [series, setSeries] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/extract_cnp_and_series', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(res.data);  // Store the API response
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    if (response) {
      setCnp(response.cnp);
      setSeries(response.series);
    }
  }, [response]);  // Runs whenever 'response' changes

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Document</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleImageChange} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
        {cnp && series && (
          <div className="mt-6">
            <p><strong>CNP:</strong> {cnp}</p>
            <p><strong>Series:</strong> {series}</p>
          </div>
        )}
      </div>
    </div>
  );
}
