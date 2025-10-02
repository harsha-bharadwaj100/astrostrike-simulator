# backend/app.py
import os
import requests
from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv() # Loads environment variables from .env file

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/api/neos')
def get_neos():
    try:
        api_key = os.getenv('NASA_API_KEY')
        api_url = f"https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={api_key}"

        print("Fetching data from NASA API...")
        response = requests.get(api_url)
        response.raise_for_status() # Will raise an exception for bad status codes
        print("Data fetched successfully.")

        data = response.json()
        # We only need the name and id for now, let's simplify the data
        simplified_data = [
            {'id': neo['id'], 'name': neo['name_limited']}
            for neo in data.get('near_earth_objects', [])
        ]

        return jsonify(simplified_data)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from NASA API: {e}")
        return jsonify({'message': 'Failed to fetch data from NASA API'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)