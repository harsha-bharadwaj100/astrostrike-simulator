# **☄️ AstroStrike Simulator**

**Global Nominee — NASA International Space Apps Challenge 2025** ("Meteor Madness" challenge)

**AstroStrike Simulator** is an interactive, data-driven web application that transforms real NASA Near-Earth Object (NEO) data into an intuitive platform for asteroid impact simulation, consequence analysis, and planetary defense exploration.

## **Project Demo**

*[Link to Project](https://www.spaceappschallenge.org/2025/find-a-team/phoneix-trio/?tab=project)*
*[Link to slides](https://docs.google.com/presentation/d/1KaMSEz0\_Xn7VqqU2F-L7Ve9e9MUnwdKB/edit?*usp=sharing\&ouid=103494869491400990983\&rtpof=true\&sd=true)*

---

## **Core Features**

1️⃣ **Real NASA Asteroid Data:**
* Live integration with NASA’s Near-Earth Object (NEO) Web Service API
* Select from actual cataloged asteroids with authentic orbital and physical parameters
2️⃣ **Custom Impact Scenarios:**
* Define hypothetical asteroids by diameter and velocity
* Instantly simulate “what-if” strike scenarios
3️⃣ **Dynamic 3D Orbital Simulation:**
* Interactive 3D Earth–asteroid visualization using React Three Fiber
* Observe approach trajectories and gravitational interaction in real time
4️⃣ **Interactive Impact Map:**
* Select impact locations on a 2D world map
* Visualize crater radius and seismic shockwave spread geographically
5️⃣ **Post-Impact Analysis Dashboard:** Receive an immediate report detailing:  
  * **Seismic Magnitude:** Compared against real-world events in a clear bar chart.  
  * **Tsunami Risk:** For ocean impacts, the tool identifies major coastal cities at risk and estimates tsunami travel time.  
6️⃣ **Planetary Defense Simulator:**
* Apply a controlled delta-v impulse to the asteroid
* Immediately observe orbital deviation outcomes
* Introduces core concepts of asteroid deflection and mitigation
7️⃣ **Educational Tooltips:**
* Learn about complex astronomical terms like "eccentricity" and "semi-major axis" through integrated tooltips.

## **How It Works**

The application is built with a decoupled frontend and backend. The React frontend provides the user interface and visualizations, while a Python Flask server acts as a simple proxy to fetch data from the NASA NEO API, bypassing CORS issues and hiding the API key.

When a user selects an asteroid or defines custom parameters, the frontend calculates the potential impact energy, crater size, and seismic magnitude using established physics formulas. This data is then passed to the various visualization components to render the simulation and reports.

## **Technology Stack**

* **Frontend:** React, React Three Fiber (for Three.js), Chart.js, Leaflet  
* **Backend:** Python (Flask), Requests  
* **Data Source:** NASA Near-Earth Object (NEO) Web Service API

## **Setup and Installation**

To run this project locally, you will need to run both the backend server and the frontend client.

### **Backend Setup**

1. **Navigate to the backend directory:**  
   ```Bash  
   cd backend

2. Install dependencies:  
   It is recommended to use a virtual environment.  
   ```Bash  
   pip install Flask flask-cors requests python-dotenv

3. **Set up your NASA API Key:**  
   * Get a free API key from [api.nasa.gov](https://api.nasa.gov/).  
   * Create a file named .env inside the backend folder.  
   * Add your API key to the .env file like this:  
     NASA\_API\_KEY=YOUR\_API\_KEY\_HERE

4. **Run the backend server:**  
   ```Bash  
   flask run

  The server will start on http://localhost:5000.

### **Frontend Setup**

1. **Navigate to the root directory and install dependencies:**  
   ```Bash  
   npm install

2. **Start the frontend development server:**  
    ```Bash  
    npm start
  The application will open in your browser at http://localhost:3000.

## **Future Scope & Enhancements**

* Integration of population density data to estimate human impact
* Expand the Planetary Defense Center with more mitigation strategies (e.g., gravity tractors, laser ablation)
* Create a "Mission Mode" with scenario-based challenges for educational use
* Performance optimization for large-scale simulations

---

## **Recognition & Credits**

**Team Phoenix Trio**
* Harsha Bharadwaj — Team Lead
* Guru Patil
* Thrisha Rajesh

## **Challenge Reference**

[NASA Space Apps Challenge — Meteor Madness](https://www.spaceappschallenge.org/2025/challenges/meteor-madness/)
