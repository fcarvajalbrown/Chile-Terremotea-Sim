import './IntensityDisplay.css';

function IntensityDisplay({ intensity, mmi, distance }) {
  // MMI scale levels for visualization
  const mmiLevels = [
    { level: 'I', min: 0, max: 1.5, name: 'Not felt', color: '#FFFFFF' },
    { level: 'II', min: 1.5, max: 2.5, name: 'Weak', color: '#ACD8E9' },
    { level: 'III', min: 2.5, max: 3.5, name: 'Weak', color: '#ACD8E9' },
    { level: 'IV', min: 3.5, max: 4.5, name: 'Light', color: '#7BC5A6' },
    { level: 'V', min: 4.5, max: 5.5, name: 'Moderate', color: '#FDE357' },
    { level: 'VI', min: 5.5, max: 6.5, name: 'Strong', color: '#FDB462' },
    { level: 'VII', min: 6.5, max: 7.5, name: 'Very strong', color: '#FB923C' },
    { level: 'VIII', min: 7.5, max: 8.5, name: 'Severe', color: '#F87171' },
    { level: 'IX', min: 8.5, max: 9.5, name: 'Violent', color: '#DC2626' },
    { level: 'X', min: 9.5, max: 10.5, name: 'Extreme', color: '#991B1B' },
    { level: 'XI', min: 10.5, max: 11.5, name: 'Extreme', color: '#7F1D1D' },
    { level: 'XII', min: 11.5, max: 99, name: 'Extreme', color: '#450A0A' },
  ];

  return (
    <div className="intensity-display card">
      <h2>Ground Motion Intensity</h2>

      {/* Distance info */}
      <div className="distance-info">
        <span className="distance-label">Distance from epicenter:</span>
        <span className="distance-value">{distance.toFixed(1)} km</span>
      </div>

      {/* MMI Scale Gauge */}
      <div className="mmi-gauge">
        {mmiLevels.map((level) => {
          const isActive = intensity >= level.min && intensity < level.max;
          return (
            <div
              key={level.level}
              className={`mmi-level ${isActive ? 'active' : ''}`}
              style={{ backgroundColor: level.color }}
              title={`${level.level}: ${level.name}`}
            >
              <span className="mmi-level-text">{level.level}</span>
            </div>
          );
        })}
      </div>

      {/* Current MMI Display */}
      <div className="current-mmi" style={{ backgroundColor: mmi.color }}>
        <div className="mmi-value">
          <span className="mmi-roman">{mmi.level}</span>
          <span className="mmi-numeric">({mmi.numericLevel})</span>
        </div>
        <div className="mmi-name">{mmi.name}</div>
      </div>

      {/* Shaking and Damage Info */}
      <div className="intensity-details">
        <div className="detail-row">
          <span className="detail-label">Shaking:</span>
          <span className="detail-value shaking">{mmi.shaking}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Potential Damage:</span>
          <span className="detail-value damage">{mmi.damage}</span>
        </div>
      </div>

      {/* Description */}
      <div className="intensity-description">
        <p>{mmi.description}</p>
      </div>

      {/* Intensity Value (for debugging/technical users) */}
      <div className="technical-info">
        <small>Intensity value: {intensity.toFixed(2)}</small>
      </div>
    </div>
  );
}

export default IntensityDisplay;