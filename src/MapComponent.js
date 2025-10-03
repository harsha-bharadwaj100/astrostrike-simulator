// src/MapComponent.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

const MapComponent = ({ details, simResults, mitigation }) => {
  const impactPosition = [20.5937, 78.9629]; // Central India - a placeholder
  const initialMiss = 2500000; // An arbitrary initial miss distance in meters for simulation

  // Calculate the new impact point based on mitigation
  const getImpactPosition = () => {
    const deflection = mitigation.velocityChange * 100000; // Amplified for visual effect
    const missDistance = initialMiss - deflection;
    const degreesLatitudeShift = missDistance / 111139; // meters to degrees approx
    return [impactPosition[0], impactPosition[1] + degreesLatitudeShift];
  };

  const currentImpactPosition = mitigation.isActive
    ? getImpactPosition()
    : impactPosition;
  const impactName = details ? details.name : "Custom Asteroid";
  const craterRadiusMeters = simResults
    ? simResults.craterDiameterKm * 1000
    : 0;

  return (
    <div className="map-container">
      <h3>Impact Zone Simulation</h3>
      <MapContainer
        center={currentImpactPosition}
        zoom={3}
        style={{ height: "400px", width: "100%" }}
        key={currentImpactPosition.toString()}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {simResults && (
          <>
            <Marker position={currentImpactPosition}>
              <Popup>{impactName} Impact Point</Popup>
            </Marker>
            <Circle
              center={currentImpactPosition}
              radius={craterRadiusMeters}
              pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.3 }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
