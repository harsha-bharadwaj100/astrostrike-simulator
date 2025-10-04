import React, { useMemo } from "react";
// ✨ IMPORT THE BAR CHART COMPONENT AND CHARTJS MODULES
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { coastalCities } from "./data/coastalCities";
import { haversineDistance } from "./utils/physics";

// ✨ REGISTER THE NECESSARY CHARTJS MODULES
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ImpactReport = ({ simResults, impactPosition, isOceanImpact }) => {
  // ✨ DATA CONFIGURATION FOR THE BAR CHART
  const seismicChartData = {
    labels: [
      "Your Impact",
      "Tōhoku 2011",
      "San Francisco 1906",
      "Mt. St. Helens 1980",
    ],
    datasets: [
      {
        label: "Richter Scale Magnitude",
        data: [
          simResults.seismicMagnitude.toFixed(2),
          9.1, // Magnitude of the 2011 Tōhoku earthquake
          7.9, // Magnitude of the 1906 San Francisco earthquake
          5.1, // Seismic event from the 1980 Mt. St. Helens eruption
        ],
        backgroundColor: ["#e94560", "#1f4068", "#1f4068", "#1f4068"],
        borderColor: "#61dafb",
        borderWidth: 1,
      },
    ],
  };

  // Chart options to make it readable on a dark background
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Richter Scale Magnitude",
        color: "#e0e0e0",
      },
    },
    scales: {
      y: {
        ticks: { color: "#e0e0e0" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "#e0e0e0" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  const tsunamiRiskData = useMemo(() => {
    if (!isOceanImpact) return null;
    const WAVE_SPEED_KPH = 800;
    const RISK_RADIUS_KM = 4000;

    return coastalCities
      .map((city) => ({
        ...city,
        distance: haversineDistance(impactPosition, city),
      }))
      .filter((city) => city.distance < RISK_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
      .map((city) => ({
        ...city,
        travelTimeHours: (city.distance / WAVE_SPEED_KPH).toFixed(1),
      }));
  }, [impactPosition, isOceanImpact]);

  return (
    <div className="impact-report-section">
      <h2>Post-Impact Analysis</h2>
      <div className="report-grid">
        {/* ✨ NEW GRID ITEM FOR THE BAR CHART */}
        <div className="report-item">
          <h3>Seismic Magnitude Comparison</h3>
          <Bar data={seismicChartData} options={chartOptions} />
        </div>
        <div className="report-item">
          <h3>Tsunami Risk Assessment</h3>
          {isOceanImpact && tsunamiRiskData ? (
            <div>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: "cyan" }}>High Risk</span> (Ocean Impact
                Selected)
              </p>
              <p>
                <strong>Cities at Risk (Top 5):</strong>
              </p>
              {tsunamiRiskData.length > 0 ? (
                <ul className="tsunami-city-list">
                  {tsunamiRiskData.slice(0, 5).map((city) => (
                    <li key={city.name}>
                      <strong>{city.name}:</strong> ~{city.travelTimeHours} hrs
                      ({city.distance.toFixed(0)} km)
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  No major coastal cities in database within immediate risk
                  radius.
                </p>
              )}
            </div>
          ) : (
            <div>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: "lightgreen" }}>Low Risk</span> (Land
                Impact)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImpactReport;
