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

// This fix for the default marker icon should remain
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
  isOceanImpact,
}) => {
  const impactName = simResults ? "Simulated Impact" : "Set Target Location";
  const craterRadius =
    isHit && simResults ? simResults.craterDiameterKm * 1000 : 0;

  return (
    <div className="map-container">
      <h3>Impact Zone Analysis (Click to set target)</h3>
      <MapContainer
        center={impactPosition}
        zoom={3}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <MapClickHandler setPosition={setImpactPosition} />
        <Marker position={impactPosition}>
          <Popup>{impactName}</Popup>
        </Marker>

        {isHit && craterRadius > 0 && (
          <>
            {/* ✨ REMOVED: The large blue tsunami circle is now gone */}

            {/* Seismic "ShakeMap" Rings */}
            <Circle
              center={impactPosition}
              radius={craterRadius * 8}
              pathOptions={{
                color: "yellow",
                fillColor: "yellow",
                fillOpacity: 0.2,
              }}
            />
            <Circle
              center={impactPosition}
              radius={craterRadius * 3}
              pathOptions={{
                color: "orange",
                fillColor: "orange",
                fillOpacity: 0.3,
              }}
            />
            <Circle
              center={impactPosition}
              radius={craterRadius}
              pathOptions={{
                color: "#e94560",
                fillColor: "#e94560",
                fillOpacity: 0.5,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
