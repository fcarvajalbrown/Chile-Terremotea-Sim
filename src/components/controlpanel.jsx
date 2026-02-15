import './ControlPanel.css';

function ControlPanel({ magnitude, depth, onMagnitudeChange, onDepthChange }) {
  return (
    <div className="control-panel card">
      <h2>Simulation Parameters</h2>
      
      {/* Magnitude Slider */}
      <div className="slider-container">
        <label htmlFor="magnitude-slider">
          Magnitude (Mw)
          <span className="slider-value">{magnitude.toFixed(1)}</span>
        </label>
        <input
          id="magnitude-slider"
          type="range"
          min="5.0"
          max="9.5"
          step="0.1"
          value={magnitude}
          onChange={(e) => onMagnitudeChange(parseFloat(e.target.value))}
        />
        <div className="slider-info">
          <span className="info-text">
            {getMagnitudeDescription(magnitude)}
          </span>
        </div>
      </div>

      {/* Depth Slider */}
      <div className="slider-container">
        <label htmlFor="depth-slider">
          Depth
          <span className="slider-value">{depth} km</span>
        </label>
        <input
          id="depth-slider"
          type="range"
          min="5"
          max="100"
          step="5"
          value={depth}
          onChange={(e) => onDepthChange(parseInt(e.target.value))}
        />
        <div className="slider-info">
          <span className="info-text">
            {getDepthDescription(depth)}
          </span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="presets">
        <h3>Quick Scenarios</h3>
        <div className="preset-buttons">
          <button
            className="preset-btn"
            onClick={() => {
              onMagnitudeChange(8.8);
              onDepthChange(35);
            }}
          >
            2010 Maule
            <small>M8.8, 35km</small>
          </button>
          <button
            className="preset-btn"
            onClick={() => {
              onMagnitudeChange(9.5);
              onDepthChange(33);
            }}
          >
            1960 Valdivia
            <small>M9.5, 33km</small>
          </button>
          <button
            className="preset-btn"
            onClick={() => {
              onMagnitudeChange(6.5);
              onDepthChange(20);
            }}
          >
            Moderate
            <small>M6.5, 20km</small>
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to describe magnitude
function getMagnitudeDescription(magnitude) {
  if (magnitude < 5.5) return "Minor earthquake";
  if (magnitude < 6.0) return "Light earthquake";
  if (magnitude < 6.5) return "Moderate earthquake";
  if (magnitude < 7.0) return "Strong earthquake";
  if (magnitude < 7.5) return "Major earthquake";
  if (magnitude < 8.0) return "Great earthquake";
  return "Massive earthquake";
}

// Helper function to describe depth
function getDepthDescription(depth) {
  if (depth < 20) return "Shallow (higher intensity at surface)";
  if (depth < 50) return "Intermediate depth";
  if (depth < 70) return "Deep (lower surface intensity)";
  return "Very deep";
}

export default ControlPanel;