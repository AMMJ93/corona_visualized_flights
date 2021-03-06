![Final product](teaser.png)

# **Decisions:**

- Show corona on map
- Outgoing flights per country

# **Charts:**
- Corona cases
- Flights

# **Interactivity:**
- Play button
- On country click: update both charts
 
# **Visuals:**
- Dots for corona cases per country
- Sliding line over chart when play button clicked


# **Instructions**
* Make sure git & node.js(+NPM) are installed
* Clone git repo
* Copy and rename `client/charts/plotly-secret.example.js` -> `plotly-secret.js`
* Copy and rename `.env.example` -> `.env` (Fill in the required fields)
* Open terminal in the root folder of the project
* $ `npm install` to install all the dependencies
* $ `npm start` to start the application
* go to http://localhost:3000 to check it out

# **Where to find stuff?**
* JavaScript root: `/client/main.js` loads the map & chart javascript
* Leaflet Map code: `/client/leaflet/Map.js`
* First example Chart.js code: `/client/charts/CoronaChart.js`
* First example Plotly code: `/client/charts/FlightChart.js`

# **Node.js**
* `npm install <package name> --save` installs the package and adds it to package.json (dependency list for this app) 