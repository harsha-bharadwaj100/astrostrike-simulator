import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import SceneComponent from "./SceneComponent";
import ImpactReport from "./ImpactReport";
import {
  calculateImpactEnergy,
  calculateCraterDiameter,
  calculateSeismicMagnitude,
} from "./utils/physics";
import "./App.css";

function App() {
  const [asteroids, setAsteroids] = useState([]);
  const [selectedAsteroidId, setSelectedAsteroidId] = useState("");
  const [details, setDetails] = useState(null);
  const [mode, setMode] = useState("preset");
  const [customParams, setCustomParams] = useState({
    diameter: 100,
    velocity: 20,
  });
  const [simResults, setSimResults] = useState(null);
  const [mitigation, setMitigation] = useState({
    isActive: false,
    velocityChange: 0,
  });
  const [impactPosition, setImpactPosition] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });
  const [impactOccurred, setImpactOccurred] = useState(false);
  // ✨ REVERTED: State is now controlled by a manual checkbox again
  const [isOceanImpact, setIsOceanImpact] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/neos")
      .then((res) => res.json())
      .then((data) => setAsteroids(data))
      .catch((err) => console.error("Could not fetch asteroid list.", err));
  }, []);

  useEffect(() => {
    if (mode !== "preset" || !selectedAsteroidId) {
      setDetails(null);
      setSimResults(null);
      return;
    }
    fetch(`http://localhost:5000/api/neo/${selectedAsteroidId}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
      })
      .catch((err) => console.error("Could not fetch details.", err));
  }, [selectedAsteroidId, mode]);

  const handleCustomParamChange = (e) => {
    setCustomParams({ ...customParams, [e.target.name]: e.target.value });
  };

  const handleSimulate = () => {
    setImpactOccurred(false);
    let diameter, velocity;
    if (mode === "preset" && details) {
      diameter = details.estimated_diameter.meters.estimated_diameter_max;
      velocity =
        details.close_approach_data[0].relative_velocity.kilometers_per_second;
    } else {
      diameter = customParams.diameter;
      velocity = customParams.velocity;
    }
    const energy = calculateImpactEnergy(diameter, velocity);
    const craterDiameterKm = calculateCraterDiameter(energy.joules);
    const seismicMagnitude = calculateSeismicMagnitude(energy.joules);

    // ✨ REVERTED: Removed energyDistribution from the results
    setSimResults({
      energyMegatons: energy.megatons,
      craterDiameterKm,
      seismicMagnitude,
    });
    setMitigation({ isActive: true, velocityChange: 0 });
  };

  const handleMitigationChange = (e) => {
    setMitigation({
      ...mitigation,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleImpact = () => {
    setImpactOccurred(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AstroStrike Simulator ☄️</h1>
        <p>
          A data-driven tool for modeling asteroid impact scenarios,
          consequences, and mitigation strategies.
        </p>
      </header>

      <div className="controls-container">
        <div className="mode-selector">
          <label>
            <input
              type="radio"
              value="preset"
              checked={mode === "preset"}
              onChange={() => setMode("preset")}
            />{" "}
            Select Real NEO
          </label>
          <label>
            <input
              type="radio"
              value="custom"
              checked={mode === "custom"}
              onChange={() => setMode("custom")}
            />{" "}
            Create Custom Scenario
          </label>
        </div>
        {mode === "preset" ? (
          <select
            onChange={(e) => setSelectedAsteroidId(e.target.value)}
            value={selectedAsteroidId}
            className="asteroid-select"
          >
            <option value="">-- Select an Asteroid --</option>
            {asteroids.map((ast) => (
              <option key={ast.id} value={ast.id}>
                {ast.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="custom-params">
            <label>
              Diameter (m):
              <input
                type="number"
                name="diameter"
                value={customParams.diameter}
                onChange={handleCustomParamChange}
              />
            </label>
            <label>
              Velocity (km/s):
              <input
                type="number"
                name="velocity"
                value={customParams.velocity}
                onChange={handleCustomParamChange}
              />
            </label>
          </div>
        )}
        <button onClick={handleSimulate} className="simulate-button">
          Simulate Impact
        </button>
      </div>

      <div className="main-content">
        {simResults && (
          <div className="results-section">
            <h2>Initial Conditions & Potential Effects</h2>
            <div className="details-grid">
              <p>
                <strong>Impact Energy:</strong>{" "}
                {simResults.energyMegatons.toFixed(2)} Megatons TNT
              </p>
              <p>
                <strong>Crater Diameter:</strong>{" "}
                {simResults.craterDiameterKm.toFixed(2)} km
              </p>
              <p>
                <strong>Seismic Magnitude:</strong>{" "}
                {simResults.seismicMagnitude.toFixed(2)} (Richter Scale)
              </p>
            </div>
            {/* ✨ REVERTED: Checkbox is back */}
            <div className="ocean-impact-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={isOceanImpact}
                  onChange={(e) => setIsOceanImpact(e.target.checked)}
                />
                Simulate as Ocean Impact (for Tsunami Analysis)
              </label>
            </div>
          </div>
        )}

        {impactOccurred && simResults && (
          <ImpactReport
            simResults={simResults}
            impactPosition={impactPosition}
            isOceanImpact={isOceanImpact}
          />
        )}

        {mitigation.isActive && (
          <div className="mitigation-section">
            <h2>🌍 Planetary Defense Center</h2>
            <p>
              Apply an impulse to deflect the asteroid. The orbit will update in
              real-time based on gravitational physics.
            </p>
            <label>
              Impulse (Δv m/s): {mitigation.velocityChange}
              <input
                type="range"
                name="velocityChange"
                min="0"
                max="10"
                step="0.1"
                value={mitigation.velocityChange}
                onChange={handleMitigationChange}
              />
            </label>
            <p
              style={{
                color: impactOccurred ? "#e94560" : "#28a745",
                fontWeight: "bold",
                fontSize: "1.2em",
              }}
            >
              SIMULATION STATUS:{" "}
              {impactOccurred
                ? "IMPACT DETECTED!"
                : "COURSE IS CLEAR... FOR NOW."}
            </p>
          </div>
        )}

        <div id="visuals-section" className="visuals-section">
          <MapComponent
            simResults={simResults}
            impactPosition={impactPosition}
            setImpactPosition={setImpactPosition}
            isHit={impactOccurred}
            isOceanImpact={isOceanImpact}
          />
          <div className="scene-container">
            {mitigation.isActive && (
              <SceneComponent
                details={details}
                customParams={customParams}
                mode={mode}
                mitigation={mitigation}
                onImpact={handleImpact}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
