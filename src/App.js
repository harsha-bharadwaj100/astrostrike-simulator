// src/App.js - FINAL VERSION FOR DAY 1
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [asteroids, setAsteroids] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from our backend API
    fetch("http://localhost:5000/api/neos") // This is your backend's address
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAsteroids(data);
      })
      .catch((error) => {
        console.error("There was a problem fetching the asteroid data:", error);
        setError("Could not load data. Is the backend server running?");
      });
  }, []); // The empty array ensures this runs only once

  return (
    <div className="App">
      <header className="App-header">
        <h1>AstroStrike Simulator</h1>
        <h2>Near-Earth Objects</h2>
        <div className="asteroid-list">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {asteroids.length > 0 ? (
            <ul>
              {asteroids.map((asteroid) => (
                <li key={asteroid.id}>{asteroid.name}</li>
              ))}
            </ul>
          ) : (
            !error && <p>Fetching data from NASA...</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
