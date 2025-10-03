import os
import math
import requests
from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

# Constants for impact calculations
DENSITY = 3000  # kg/m³ assumed asteroid density
JOULES_PER_MEGATON = 4.184e15

def calculate_impact_energy(mass, velocity):
    return 0.5 * mass * velocity ** 2

def estimate_crater_diameter(energy_megatons):
    return 1.8 * (energy_megatons) ** (1/3)

@app.route('/api/neos')
def get_neos():
    try:
        api_key = os.getenv('NASA_API_KEY')
        url = f"https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={api_key}"
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()
        return jsonify([
            {'id': neo['id'], 'name': neo['name']}
            for neo in data.get('near_earth_objects', [])
        ])
    except requests.exceptions.RequestException:
        return jsonify({'message': 'Failed to fetch asteroids from NASA API'}), 500

@app.route('/api/neo/<neo_id>')
def get_neo_details(neo_id):
    try:
        api_key = os.getenv('NASA_API_KEY')
        url = f"https://api.nasa.gov/neo/rest/v1/neo/{neo_id}?api_key={api_key}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        diameter_max = data['estimated_diameter']['meters']['estimated_diameter_max']
        velocity_kps = float(data['close_approach_data'][0]['relative_velocity']['kilometers_per_second'])
        miss_distance_km = float(data['close_approach_data'][0]['miss_distance']['kilometers'])
        close_approach_date = data['close_approach_data'][0]['close_approach_date']  # Newly added
        orbital_data = data.get('orbital_data', {})

        velocity_mps = velocity_kps * 1000
        radius_m = diameter_max / 2
        volume_m3 = (4/3) * math.pi * (radius_m ** 3)
        mass_kg = DENSITY * volume_m3

        energy_joules = calculate_impact_energy(mass_kg, velocity_mps)
        energy_megatons = energy_joules / JOULES_PER_MEGATON
        crater_diameter_km = estimate_crater_diameter(energy_megatons)

        orbital_params = {
            'semi_major_axis_au': orbital_data.get('semi_major_axis'),
            'eccentricity': orbital_data.get('eccentricity'),
            'inclination_deg': orbital_data.get('inclination')
        }

        result = {
            'id': data['id'],
            'name': data['name'],
            'diameter_m': diameter_max,
            'velocity_kps': velocity_kps,
            'miss_distance_km': miss_distance_km,
            'close_approach_date': close_approach_date,  # Add to response
            'orbital_params': orbital_params,
            'impact_energy_megatons': round(energy_megatons, 2),
            'estimated_crater_diameter_km': round(crater_diameter_km, 2)
        }

        return jsonify(result)

    except (requests.exceptions.RequestException, KeyError, IndexError):
        return jsonify({'message': 'Failed to fetch asteroid details or calculate impact data'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
