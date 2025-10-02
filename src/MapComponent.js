// src/MapComponent.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapComponent = ({ details }) => {
  // Use a default position if no details are provided yet
  const position = [20, 0]; // Centered on the globe
  const name = details ? details.name : "Awaiting Selection";

  return (
    <div className="map-container">
      <h3>Impact Zone Simulation</h3>
      <MapContainer
        center={position}
        zoom={2}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {details && (
          <Marker position={position}>
            <Popup>{name} Impact Point</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
