// src/App.js
import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import SceneComponent from "./SceneComponent";
import "./App.css";

function App() {
  const [asteroids, setAsteroids] = useState([]); // For dropdown list
  const [selectedAsteroidId, setSelectedAsteroidId] = useState("");
  const [details, setDetails] = useState(null); // For selected asteroid's details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Effect 1: Fetch the list of all asteroids for the dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/neos")
      .then((res) => res.json())
      .then((data) => setAsteroids(data))
      .catch((err) => setError("Could not fetch asteroid list."));
  }, []);

  // Effect 2: Fetch details when a user selects an asteroid from the dropdown
  useEffect(() => {
    if (!selectedAsteroidId) {
      setDetails(null);
      return;
    }

    setLoading(true);
    setError("");
    fetch(`http://localhost:5000/api/neo/${selectedAsteroidId}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not fetch asteroid details.");
        setLoading(false);
      });
  }, [selectedAsteroidId]);

  const handleSelectChange = (event) => {
    setSelectedAsteroidId(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AstroStrike Simulator ☄️</h1>
        <p>Select a Near-Earth Object to analyze its potential impact.</p>
      </header>

      <div className="controls-container">
        <select
          onChange={handleSelectChange}
          value={selectedAsteroidId}
          className="asteroid-select"
        >
          <option value="">-- Select an Asteroid --</option>
          {asteroids.map((asteroid) => (
            <option key={asteroid.id} value={asteroid.id}>
              {asteroid.name}
            </option>
          ))}
        </select>
      </div>

      <div className="main-content">
        {loading && <p>Loading details...</p>}
        {error && <p className="error-message">{error}</p>}

        {details && (
          <div id="details-section" className="details-section">
            <h2>Details for {details.name}</h2>
            <div className="details-grid">
              <p>
                <strong>Diameter:</strong>{" "}
                {Math.round(
                  details.estimated_diameter.meters.estimated_diameter_max
                )}{" "}
                meters
              </p>
              <p>
                <strong>Potentially Hazardous:</strong>{" "}
                {details.is_potentially_hazardous_asteroid ? "Yes" : "No"}
              </p>
              <p>
                <strong>Closest Approach:</strong>{" "}
                {details.close_approach_data[0].close_approach_date_full}
              </p>
              <p>
                <strong>Relative Velocity:</strong>{" "}
                {Math.round(
                  details.close_approach_data[0].relative_velocity
                    .kilometers_per_second
                )}{" "}
                km/s
              </p>
            </div>
          </div>
        )}

        <div id="visuals-section" className="visuals-section">
          <MapComponent details={details} />
          <SceneComponent details={details} />
        </div>
      </div>
    </div>
  );
}

export default App;
