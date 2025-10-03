import React, { useState, useEffect } from "react";
import "./App.css";

// Rounded info tooltip component
const Tooltip = ({ text }) => (
  <span className="tooltip-container" tabIndex="0" aria-label={text}>
    <span className="info-circle">i</span>
    <span className="tooltip-text">{text}</span>
  </span>
);

function App() {
  const [asteroids, setAsteroids] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/neos")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch asteroid list");
        return res.json();
      })
      .then((data) => {
        setAsteroids(data);
        setLoadingList(false);
      })
      .catch(() => {
        setError("Error loading asteroid list");
        setLoadingList(false);
      });
  }, []);

useEffect(() => {
  if (!selectedId) {
    setDetails(null);
    return;
  }
  setLoadingDetails(true);
  fetch(`http://localhost:5000/api/neo/${selectedId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch asteroid details");
      return res.json();
    })
    .then((data) => {
      setDetails(data);
      setLoadingDetails(false);
      setError(null);
    })
    .catch(() => {
      setError("Error loading asteroid details");
      setLoadingDetails(false);
    });
}, [selectedId]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="center-text">AstroStrike Simulator</h1>
        <h2 className="center-text">
          Choose a Near-Earth Object to Explore Potential Impact
        </h2>

        {error && <p className="center-text" style={{ color: "red" }}>{error}</p>}

        {loadingList ? (
          <p className="center-text">Loading asteroid list...</p>
        ) : (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            aria-label="Select an asteroid"
          >
            <option value="">-- Select Asteroid --</option>
            {asteroids.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        )}

        {loadingDetails && (
          <p className="center-text">Loading asteroid details...</p>
        )}

        {/* Horizontal asteroid panel */}
        {details && !loadingDetails && (
          <div
            className="asteroid-horizontal-panel"
            role="region"
            aria-live="polite"
          >{/* Event Parameters Left */}
  <div className="astro-main">
  <div className="group-title">Event Parameters</div>
  <div className="impact-group">
    <div>
      <p>
        <strong>Diameter:</strong> {Math.round(details.diameter_m)} m <Tooltip text="Approximate asteroid width" />
      </p>
      <p>
        <strong>Impact Energy:</strong> {(details.impact_energy_megatons / 1000).toFixed(1)} Gt <Tooltip text="Estimated energy released if the asteroid were to impact Earth" />
      </p>
    </div>
    <div>
      <p>
        <strong>Velocity:</strong> {details.velocity_kps.toFixed(1)} km/s <Tooltip text="Relative speed of the asteroid as it passes close to Earth" />
      </p>
      <p>
        <strong>Crater Diameter:</strong> {details.estimated_crater_diameter_km.toFixed(1)} km <Tooltip text="Size of impact crater if collision occurs" />
      </p>
    </div>
    <div>
      <p>
        <strong>Miss Distance:</strong> {(details.miss_distance_km / 1_000_000).toFixed(2)} Gm <Tooltip text="Closest distance asteroid will pass by Earth" />
      </p>
  <p>
  <strong>Encounter date:</strong>{" "}
  {details.close_approach_date ? new Date(details.close_approach_date).toLocaleDateString() : "N/A"}{" "}
  <Tooltip
    text={
      details.close_approach_date &&
      new Date(details.close_approach_date) < new Date()
        ? "Date when the asteroid made its closest approach to Earth."
        : "Date when the asteroid will make its closest approach to Earth."
    }
  />
</p>
</div>
  </div>
</div>

  {/* Orbital Parameters Right */}
  <div className="astro-orbit">
    <div className="group-title">Orbital Parameters</div>
    <p>
      <strong>Semi-major axis:</strong> {details.orbital_params.semi_major_axis_au ? Number(details.orbital_params.semi_major_axis_au).toFixed(4) : "N/A"} AU <Tooltip text="Average distance from asteroid to the Sun" />
    </p>
    <p>
      <strong>Eccentricity:</strong> {details.orbital_params.eccentricity ? Number(details.orbital_params.eccentricity).toFixed(4) : "N/A"} <Tooltip text="Orbit shape: 0 is circle, closer to 1 is ellipse" />
    </p>
    <p>
      <strong>Inclination:</strong> {details.orbital_params.inclination_deg ? Number(details.orbital_params.inclination_deg).toFixed(3) : "N/A"}° <Tooltip text="Tilt of the asteroid’s orbit relative to Earth's orbital plane." />
    </p>
  </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
