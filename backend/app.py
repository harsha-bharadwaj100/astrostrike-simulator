# backend/app.py - UPDATED
import os
import requests
from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)


# This endpoint stays the same - it's for the dropdown list
@app.route("/api/neos")
def get_neos():
    try:
        api_key = os.getenv("NASA_API_KEY")
        api_url = f"https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={api_key}"
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        simplified_data = [
            {"id": neo["id"], "name": neo["name"]}  # Using full 'name' now
            for neo in data.get("near_earth_objects", [])
        ]
        return jsonify(simplified_data)
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Failed to fetch NEO list: {e}"}), 500


# NEW ENDPOINT - Gets details for a single asteroid
@app.route("/api/neo/<string:asteroid_id>")
def get_neo_details(asteroid_id):
    try:
        api_key = os.getenv("NASA_API_KEY")
        api_url = (
            f"https://api.nasa.gov/neo/rest/v1/neo/{asteroid_id}?api_key={api_key}"
        )
        print(f"Fetching details for asteroid {asteroid_id}...")
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        print("Details fetched successfully.")
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return (
            jsonify(
                {"message": f"Failed to fetch details for asteroid {asteroid_id}: {e}"}
            ),
            500,
        )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
