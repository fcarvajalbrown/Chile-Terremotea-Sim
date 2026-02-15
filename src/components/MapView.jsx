import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapView({ epicenter, cities, selectedCity, onEpicenterChange, magnitude, depth }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const epicenterMarkerRef = useRef(null);
  const cityMarkersRef = useRef([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on Chile
    const map = L.map(mapRef.current, {
      center: [-33.4489, -70.6693], // Santiago
      zoom: 6,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update epicenter marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing epicenter marker
    if (epicenterMarkerRef.current) {
      map.removeLayer(epicenterMarkerRef.current);
    }

    // Create custom red icon for epicenter
    const epicenterIcon = L.divIcon({
      className: 'epicenter-marker',
      html: `
        <div class="epicenter-icon">
          <div class="epicenter-pulse"></div>
          <div class="epicenter-dot"></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Create draggable epicenter marker
    const marker = L.marker([epicenter.lat, epicenter.lon], {
      icon: epicenterIcon,
      draggable: true,
      title: 'Epicenter (drag to move)',
    }).addTo(map);

    // Add popup with magnitude and depth
    marker.bindPopup(`
      <div class="epicenter-popup">
        <strong>Epicenter</strong><br>
        Magnitude: ${magnitude.toFixed(1)}<br>
        Depth: ${depth} km<br>
        <small>Drag to relocate</small>
      </div>
    `);

    // Handle drag end
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onEpicenterChange({ lat: pos.lat, lon: pos.lng });
    });

    epicenterMarkerRef.current = marker;
  }, [epicenter, magnitude, depth, onEpicenterChange]);

  // Update city markers
  useEffect(() => {
    if (!mapInstanceRef.current || cities.length === 0) return;

    const map = mapInstanceRef.current;

    // Remove existing city markers
    cityMarkersRef.current.forEach(marker => map.removeLayer(marker));
    cityMarkersRef.current = [];

    // Add city markers
    cities.forEach(city => {
      const isSelected = city.city === selectedCity;

      // Create custom icon for cities
      const cityIcon = L.divIcon({
        className: 'city-marker',
        html: `
          <div class="city-icon ${isSelected ? 'selected' : ''}">
            <div class="city-dot"></div>
          </div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker([city.lat, city.lon], {
        icon: cityIcon,
        title: city.city,
      }).addTo(map);

      // Add popup with city info
      marker.bindPopup(`
        <div class="city-popup">
          <strong>${city.city}</strong><br>
          Population: ${city.population.toLocaleString()}<br>
          ${isSelected ? '<em>Analysis Location</em>' : ''}
        </div>
      `);

      cityMarkersRef.current.push(marker);
    });
  }, [cities, selectedCity]);

  // Add click handler to set epicenter
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    const handleMapClick = (e) => {
      onEpicenterChange({ lat: e.latlng.lat, lon: e.latlng.lng });
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [onEpicenterChange]);

  return (
    <div className="map-view">
      <div ref={mapRef} className="map-container"></div>
      <div className="map-instructions">
        <span className="instruction-icon">💡</span>
        <span>Click on map or drag the red marker to set epicenter location</span>
      </div>
    </div>
  );
}

export default MapView;