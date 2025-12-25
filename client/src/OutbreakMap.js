import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const districtCoordinates = {
  "Ri-Bhoi": [25.9030, 91.8813],
  "East Khasi Hills": [25.5786, 91.8823],
  "West Jaintia Hills": [25.4508, 92.3667],
  "Goalpara": [26.4333, 90.3667],
  "Cachar": [24.7821, 92.8577],
  "Karimganj": [24.85, 92.35],
  "Hailakandi": [24.68, 92.57],
  "Dibrugarh": [27.47, 94.92],
  "Bishnupur": [24.630360, 93.759827],
  "West Imphal": [24.782784, 93.885895],
  "Imphal East": [24.80, 93.95],
  "North Tripura": [24.3167, 92.0167],
  "Unakoti": [24.3167, 92.0667],
  "West Tripura": [23.8333, 91.2833],
  "South Tripura": [23.3667, 91.5333],
  "West Garo Hills": [25.5679, 90.2245],
  "South Garo Hills": [25.3016, 90.5853],
  "North Garo Hills": [25.8968, 90.6160],
  "East Jaintia Hills": [25.3597, 92.3668]
};

function OutbreakMap({ cases: propCases }) {
  const [allCases, setAllCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('All');
  const [totalCases, setTotalCases] = useState(0);
  const [northeastCases, setNortheastCases] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch aggregate data
        const totalRes = await axios.get('/api/cases/total');
        setTotalCases(totalRes.data.total);
        const northeastRes = await axios.get('/api/cases/northeast');
        setNortheastCases(northeastRes.data.total);

        // Fetch all case details
        let casesData;
        if (propCases && propCases.length > 0) {
          casesData = propCases;
        } else {
          const casesRes = await axios.get('/api/cases');
          console.log('Fetched cases:', casesRes.data);
          casesData = casesRes.data;
        }

        // Add coordinates to cases
        const casesWithCoords = casesData.map(c => ({
          ...c,
          latitude: districtCoordinates[c.district] ? districtCoordinates[c.district][0] : null,
          longitude: districtCoordinates[c.district] ? districtCoordinates[c.district][1] : null,
        }));
        setAllCases(casesWithCoords);

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [propCases]);

  useEffect(() => {
    // Get unique diseases
    if (allCases.length > 0) {
      const uniqueDiseases = ['All', ...new Set(allCases.map(c => c.disease))];
      setDiseases(uniqueDiseases);

      // Filter cases based on selected disease
      if (selectedDisease === 'All') {
        setFilteredCases(allCases);
      } else {
        setFilteredCases(allCases.filter(c => c.disease === selectedDisease));
      }
    }
  }, [allCases, selectedDisease]);

  const handleDiseaseChange = (e) => {
    setSelectedDisease(e.target.value);
  };

  const position = [25.57, 91.88]; // Center of Meghalaya

  console.log('Filtered cases:', filteredCases);
  const markers = Object.keys(districtCoordinates).map((district, index) => {
    const casesInDistrict = filteredCases.filter(c => c.district === district);
    const position = districtCoordinates[district];

    return (
      <Marker key={index} position={position}>
        <Popup>
          <b>{district}</b><br />
          {casesInDistrict.length > 0 ? (
            casesInDistrict.map((caseData, i) => (
              <div key={i}>
                Reported Disease: {caseData.disease}<br />
                Cases: {caseData.cases}
              </div>
            ))
          ) : (
            "No reported cases"
          )}
        </Popup>
      </Marker>
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ backgroundColor: '#ffcccb', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>Overall India</h3>
          <p>{totalCases}</p>
        </div>
        <div style={{ backgroundColor: '#add8e6', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>Northeast India</h3>
          <p>{northeastCases}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Outbreak Hotspots</h5>
          
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="disease-filter" style={{marginRight: '10px'}}>Filter by Disease: </label>
            <select id="disease-filter" value={selectedDisease} onChange={handleDiseaseChange} style={{padding: '5px', borderRadius: '5px'}}>
              {diseases.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <MapContainer key={selectedDisease} center={position} zoom={7} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default OutbreakMap;
