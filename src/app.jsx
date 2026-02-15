import { useState, useEffect } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import MapView from './components/MapView';
import IntensityDisplay from './components/IntensityDisplay';
import DamageEstimate from './components/DamageEstimate';
import HistoricalComparison from './components/HistoricalComparison';
import { calculateIntensity } from './utils/attenuationModel';
import { calculateHypocentralDistance } from './utils/geoUtils';
import { getMMI } from './utils/mmiScale';
import { estimateDamage, estimateAffectedPopulation } from './utils/damageModel';

function App() {
  // Simulation state
  const [magnitude, setMagnitude] = useState(7.5);
  const [depth, setDepth] = useState(35);
  const [epicenter, setEpicenter] = useState({
    lat: -33.4489, // Santiago default
    lon: -70.6693,
  });
  const [selectedCity, setSelectedCity] = useState('Santiago');

  // Data state
  const [cities, setCities] = useState([]);
  const [historicalQuakes, setHistoricalQuakes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculated results
  const [results, setResults] = useState(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load cities CSV
        const citiesResponse = await fetch('/chile-earthquake-simulator/cities.csv');
        const citiesText = await citiesResponse.text();
        const citiesData = parseCSV(citiesText);
        setCities(citiesData);

        // Load historical quakes JSON
        const quakesResponse = await fetch('/chile-earthquake-simulator/historical_quakes_clean.json');
        const quakesData = await quakesResponse.json();
        setHistoricalQuakes(quakesData);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Parse CSV helper
  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        city: values[0],
        lat: parseFloat(values[1]),
        lon: parseFloat(values[2]),
        population: parseInt(values[3]),
      };
    });
  };

  // Calculate results whenever simulation parameters change
  useEffect(() => {
    if (cities.length === 0) return;

    // Find selected city
    const city = cities.find(c => c.city === selectedCity) || cities[0];
    if (!city) return;

    // Calculate hypocentral distance
    const distance = calculateHypocentralDistance(
      epicenter.lat,
      epicenter.lon,
      city.lat,
      city.lon,
      depth
    );

    // Calculate intensity
    const intensityValue = calculateIntensity(magnitude, depth, distance);

    // Get MMI
    const mmi = getMMI(intensityValue);

    // Calculate damage
    const damagePercent = estimateDamage(intensityValue);
    const affectedPop = estimateAffectedPopulation(city.population, damagePercent);

    setResults({
      city: city.city,
      distance,
      intensityValue,
      mmi,
      damagePercent,
      affectedPop,
    });
  }, [magnitude, depth, epicenter, selectedCity, cities]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '20px',
        color: '#666'
      }}>
        Loading Chile Earthquake Simulator...
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Chile Earthquake Simulator</h1>
        <p>Interactive simulation of earthquake impacts in Chile</p>
      </header>

      <div className="app-layout">
        {/* Left Panel - Controls */}
        <aside className="controls-panel">
          <ControlPanel
            magnitude={magnitude}
            depth={depth}
            onMagnitudeChange={setMagnitude}
            onDepthChange={setDepth}
          />
          
          <div className="city-selector card">
            <label htmlFor="city-select">Analysis City:</label>
            <select 
              id="city-select"
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map(city => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
          </div>

          {results && (
            <>
              <IntensityDisplay 
                intensity={results.intensityValue}
                mmi={results.mmi}
                distance={results.distance}
              />
              
              <DamageEstimate
                damagePercent={results.damagePercent}
                affectedPopulation={results.affectedPop}
                city={results.city}
              />
            </>
          )}
        </aside>

        {/* Center - Map */}
        <main className="map-panel">
          <MapView
            epicenter={epicenter}
            cities={cities}
            selectedCity={selectedCity}
            onEpicenterChange={setEpicenter}
            magnitude={magnitude}
            depth={depth}
          />
        </main>

        {/* Right Panel - Historical Comparison */}
        <aside className="comparison-panel">
          <HistoricalComparison
            currentMagnitude={magnitude}
            currentDepth={depth}
            historicalQuakes={historicalQuakes}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;