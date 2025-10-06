AstroStrike Simulator ☄️
An interactive web application developed for the 2025 NASA Space Apps Challenge ("Meteor Madness" challenge). AstroStrike Simulator transforms real NASA data into an engaging, educational tool for modeling asteroid impact scenarios, understanding their consequences, and exploring potential mitigation strategies.

Demo
[[Link to the Slides](https://docs.google.com/presentation/d/1KaMSEz0_Xn7VqqU2F-L7Ve9e9MUnwdKB/edit?usp=sharing&ouid=103494869491400990983&rtpof=true&sd=true)]

Features
Real-Time NASA Data: Select from a list of actual Near-Earth Objects (NEOs), with orbital and physical data fetched directly from NASA's NEO API.

Custom Scenarios: Create your own "what-if" scenarios by defining an asteroid's diameter and velocity.

Dynamic 3D Visualization: Watch the asteroid's trajectory in a real-time 3D simulation powered by React Three Fiber, showing its gravitational interaction with Earth.

Interactive Impact Map: Set a target location on a 2D map and visualize the geographic scale of the crater and seismic shockwaves upon impact.

Post-Impact Analysis: Receive an immediate report detailing:

Seismic Magnitude: Compared against real-world events in a clear bar chart.

Tsunami Risk: For ocean impacts, the tool identifies major coastal cities at risk and estimates tsunami travel time.

Planetary Defense Simulator: Take control and attempt to deflect the asteroid by applying a "delta-v" impulse, with instant visual feedback on the outcome.

Educational Tooltips: Learn about complex astronomical terms like "eccentricity" and "semi-major axis" through integrated tooltips.

How It Works
The application is built with a decoupled frontend and backend. The React frontend provides the user interface and visualizations, while a Python Flask server acts as a simple proxy to fetch data from the NASA NEO API, bypassing CORS issues and hiding the API key.

When a user selects an asteroid or defines custom parameters, the frontend calculates the potential impact energy, crater size, and seismic magnitude using established physics formulas. This data is then passed to the various visualization components to render the simulation and reports.

Technology Stack
Frontend: React, React Three Fiber (for Three.js), Chart.js, Leaflet

Backend: Python (Flask), Requests

Data Source: NASA Near-Earth Object (NEO) Web Service API

Setup and Installation
To run this project locally, you will need to run both the backend server and the frontend client.

Backend Setup
Navigate to the backend directory:

Bash

cd backend
Install dependencies:
It is recommended to use a virtual environment.

Bash

pip install Flask flask-cors requests python-dotenv
Set up your NASA API Key:

Get a free API key from api.nasa.gov.

Create a file named .env inside the backend folder.

Add your API key to the .env file like this:

NASA_API_KEY=YOUR_API_KEY_HERE
Run the backend server:

Bash

flask run
The server will start on http://localhost:5000.

Frontend Setup
Navigate to the root directory and install dependencies:

Bash

npm install
Start the frontend development server:

Bash

npm start
The application will open in your browser at http://localhost:3000.

Future Ideas

Incorporate population density data to estimate the potential human impact of a strike.

Expand the Planetary Defense Center with more mitigation strategies (e.g., gravity tractors, laser ablation).

Create a "Mission Mode" with specific challenges and objectives for users to complete.

This project was created for the 2025 NASA Space Apps Challenge. You can view the "Meteor Madness" challenge details here.
