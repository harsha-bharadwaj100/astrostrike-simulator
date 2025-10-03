// src/App.js
import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import SceneComponent from "./SceneComponent";
import {
  calculateImpactEnergy,
  calculateCraterDiameter,
  calculateSeismicMagnitude,
} from "./utils/physics";
import "./App.css";

function App() {
  // State for data and UI mode
  const [asteroids, setAsteroids] = useState([]);
  const [selectedAsteroidId, setSelectedAsteroidId] = useState("");
  const [details, setDetails] = useState(null);
  const [mode, setMode] = useState("preset"); // 'preset' or 'custom'

  // State for custom asteroid inputs
  const [customParams, setCustomParams] = useState({
    diameter: 100,
    velocity: 20,
  });

  // State for simulation results and mitigation
  const [simResults, setSimResults] = useState(null);
  const [mitigation, setMitigation] = useState({
    isActive: false,
    velocityChange: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the list of asteroids for the dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/neos")
      .then((res) => res.json())
      .then((data) => setAsteroids(data))
      .catch((err) => setError("Could not fetch asteroid list."));
  }, []);

  // Fetch details when a user selects a preset asteroid
  useEffect(() => {
    if (mode !== "preset" || !selectedAsteroidId) {
      setDetails(null);
      setSimResults(null);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/api/neo/${selectedAsteroidId}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not fetch details.");
        setLoading(false);
      });
  }, [selectedAsteroidId, mode]);

  const handleCustomParamChange = (e) => {
    setCustomParams({ ...customParams, [e.target.name]: e.target.value });
  };

  const handleSimulate = () => {
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

    setSimResults({
      energyMegatons: energy.megatons,
      craterDiameterKm: craterDiameterKm,
      seismicMagnitude: seismicMagnitude,
    });
    setMitigation({ isActive: true, velocityChange: 0 }); // Activate mitigation on simulation
  };

  const handleMitigationChange = (e) => {
    setMitigation({ ...mitigation, velocityChange: e.target.value });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AstroStrike Simulator ☄️</h1>
        <p>
          Analyze potential impacts from Near-Earth Objects or create your own
          scenario.
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
            Select Preset Asteroid
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
              Diameter (meters):{" "}
              <input
                type="number"
                name="diameter"
                value={customParams.diameter}
                onChange={handleCustomParamChange}
              />
            </label>
            <label>
              Velocity (km/s):{" "}
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
            <h2>Simulation Results</h2>
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
          </div>
        )}

        {mitigation.isActive && (
          <div className="mitigation-section">
            <h2>🌍 Defend Earth!</h2>
            <p>
              Apply a small velocity change with a kinetic impactor to alter the
              trajectory.
            </p>
            <label>
              Velocity Change (m/s): {mitigation.velocityChange}{" "}
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={mitigation.velocityChange}
                onChange={handleMitigationChange}
              />
            </label>
            <p
              style={{
                color: mitigation.velocityChange > 2 ? "lightgreen" : "yellow",
              }}
            >
              Trajectory shifts in real-time below.
            </p>
          </div>
        )}

        <div id="visuals-section" className="visuals-section">
          <MapComponent
            details={details}
            simResults={simResults}
            mitigation={mitigation}
          />
          <SceneComponent mitigation={mitigation} />
        </div>
      </div>
    </div>
  );
}

export default App;
