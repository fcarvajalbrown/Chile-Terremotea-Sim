import './DamageEstimate.css';
import { getDamageCategory } from '../utils/damageModel';

function DamageEstimate({ damagePercent, affectedPopulation, city }) {
  const category = getDamageCategory(damagePercent);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="damage-estimate card">
      <h2>Damage Assessment</h2>

      {/* City Name */}
      <div className="location-header">
        <span className="location-icon">📍</span>
        <span className="location-name">{city}</span>
      </div>

      {/* Damage Percentage Bar */}
      <div className="damage-bar-container">
        <div className="damage-bar-label">
          <span>Estimated Damage</span>
          <span className="damage-percent">{damagePercent.toFixed(1)}%</span>
        </div>
        <div className="damage-bar-track">
          <div 
            className="damage-bar-fill"
            style={{ 
              width: `${damagePercent}%`,
              backgroundColor: category.color
            }}
          >
            {damagePercent > 15 && (
              <span className="damage-bar-text">{damagePercent.toFixed(0)}%</span>
            )}
          </div>
        </div>
        <div className="damage-bar-markers">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Damage Category */}
      <div 
        className="damage-category"
        style={{ 
          backgroundColor: category.color,
          opacity: 0.9
        }}
      >
        <div className="category-name">{category.category}</div>
        <div className="category-description">{category.description}</div>
      </div>

      {/* Affected Population Statistics */}
      <div className="population-stats">
        <h3>Population Impact</h3>
        
        <div className="stat-row">
          <div className="stat-item">
            <div className="stat-label">Total Population</div>
            <div className="stat-value total">
              {formatNumber(affectedPopulation.total)}
            </div>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-item">
            <div className="stat-label">People Affected</div>
            <div className="stat-value affected">
              {formatNumber(affectedPopulation.affected)}
              <span className="stat-percent">
                ({affectedPopulation.percentAffected}%)
              </span>
            </div>
          </div>
        </div>

        {affectedPopulation.displaced > 0 && (
          <div className="stat-row">
            <div className="stat-item">
              <div className="stat-label">Potentially Displaced</div>
              <div className="stat-value displaced">
                {formatNumber(affectedPopulation.displaced)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warning Message */}
      {damagePercent > 30 && (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">
            Significant damage expected. Emergency response would be required.
          </span>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer">
        <small>
          These are simplified estimates for educational purposes. 
          Actual damage depends on building codes, construction quality, and local conditions.
        </small>
      </div>
    </div>
  );
}

export default DamageEstimate;