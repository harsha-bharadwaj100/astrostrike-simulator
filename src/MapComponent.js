// src/MapComponent.js
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapClickHandler = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const MapComponent = ({
  simResults,
  impactPosition,
  setImpactPosition,
  isHit,
}) => {
  const impactName = simResults
    ? "Simulated Impact Location"
    : "Set Target Location";
  const craterRadiusMeters =
    isHit && simResults ? simResults.craterDiameterKm * 1000 : 0;

  return (
    <div className="map-container">
      <h3>Impact Zone Simulation (Click to set target)</h3>
      <MapContainer
        center={impactPosition}
        zoom={3}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler setPosition={setImpactPosition} />

        <Marker position={impactPosition}>
          <Popup>{impactName}</Popup>
        </Marker>

        {isHit && craterRadiusMeters > 0 && (
          <Circle
            center={impactPosition}
            radius={craterRadiusMeters}
            pathOptions={{
              color: "#e94560",
              fillColor: "#e94560",
              fillOpacity: 0.4,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
