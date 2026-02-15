import './HistoricalComparison.css';

function HistoricalComparison({ currentMagnitude, currentDepth, historicalQuakes }) {
  // Find closest historical earthquakes by magnitude
  const sortedQuakes = [...historicalQuakes]
    .sort((a, b) => Math.abs(a.magnitude - currentMagnitude) - Math.abs(b.magnitude - currentMagnitude))
    .slice(0, 5);

  return (
    <div className="historical-comparison card">
      <h2>Historical Reference</h2>
      <p className="comparison-intro">
        Similar magnitude earthquakes in Chile:
      </p>

      <div className="quakes-list">
        {sortedQuakes.map((quake, index) => (
          <div key={index} className="quake-item">
            <div className="quake-header">
              <span className="quake-magnitude">M{quake.magnitude.toFixed(1)}</span>
              <span className="quake-date">{new Date(quake.date).getFullYear()}</span>
            </div>
            <div className="quake-name">{quake.name}</div>
            {quake.depth && (
              <div className="quake-depth">Depth: {quake.depth} km</div>
            )}
          </div>
        ))}
      </div>

      <div className="current-sim">
        <strong>Current Simulation:</strong>
        <div>M{currentMagnitude.toFixed(1)} at {currentDepth} km depth</div>
      </div>
    </div>
  );
}

export default HistoricalComparison;