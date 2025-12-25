import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './EmergencySOS.css';

const containerStyle = {
  width: '100%',
  height: '400px'
};



const EmergencySOS = () => {
  const [location, setLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY // Replace with your actual API key
  });

  const handleSOS = async () => {
    setLoading(true);
    setError(null);
    setLocation(null);
    setNearbyHospitals([]);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Send alert to backend
          const response = await fetch('http://localhost:5001/api/sos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('SOS alert sent:', data);
          alert("SOS alert sent!");

          // TODO: Fetch nearby hospitals using Google Maps API or other APIs
          // For now, simulate nearby hospitals
          setNearbyHospitals([
            { name: "City Hospital", distance: "2 km", beds: 10, doctors: 5, contact: "123-456-7890", lat: latitude + 0.01, lng: longitude + 0.01 },
            { name: "General Hospital", distance: "5 km", beds: 20, doctors: 10, contact: "098-765-4321", lat: latitude - 0.02, lng: longitude - 0.02 },
          ]);
        } catch (err) {
          console.error("Error sending SOS or fetching data:", err);
          setError("Failed to send SOS or get location. Please try again.");
        } finally {
          setLoading(false);
        }
      }, (geoError) => {
        console.error("Geolocation error:", geoError);
        let errorMessage = "Geolocation access denied or unavailable.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage = "Geolocation permission denied. Please enable location access in your browser settings.";
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable. Please check your device's location services.";
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMessage = "The request to get user location timed out. Please try again.";
        }
        setError(errorMessage);
        setLoading(false);
      });
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const onLoad = useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    // setMap(null)
  }, []);

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
        <div className="emergency-sos-container">
            <h1>Emergency SOS & Nearby Hospitals</h1>
            <button className="sos-button" onClick={handleSOS} disabled={loading}>
                {loading ? 'Sending...' : 'SOS'}
            </button>

            {error && <p className="error-message">{error}</p>}

            {location && (
                <div className="info-card">
                <h2>Your Location:</h2>
                <p>Latitude: {location.lat}</p>
                <p>Longitude: {location.lng}</p>
                </div>
            )}

            {isLoaded && location && (
                <div className="map-container">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={location}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    <Marker position={location} />
                    {nearbyHospitals.map((hospital, index) => (
                    <Marker key={index} position={{ lat: hospital.lat, lng: hospital.lng }} />
                    ))}
                </GoogleMap>
                </div>
            )}

            {nearbyHospitals.length > 0 && (
                <div className="info-card">
                <h2>Nearby Hospitals:</h2>
                <ul className="hospital-list">
                    {nearbyHospitals.map((hospital, index) => (
                    <li key={index} className="hospital-item">
                        <strong>{hospital.name}</strong>
                        <p>Distance: {hospital.distance}</p>
                        <p>Available Beds: {hospital.beds}</p>
                        <p>Available Doctors: {hospital.doctors}</p>
                        <p>Contact: {hospital.contact}</p>
                    </li>
                    ))}
                </ul>
                </div>
            )}
        </div>
    </div>
  );
};

export default EmergencySOS;