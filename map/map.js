let map;
let markers = {}; // Store marker data
let leafletMarkers = {}; // Store Leaflet marker instances

const loadMap = function (id) {
  if (map) return; // Prevent reinitializing the map

  // Create map, can't zoom in too much, and force users to stay in Portland.
  map = L.map(id, {
    minZoom: 14,
    zoomControl: false,
    maxBounds: L.latLngBounds([[45.495, -122.724], [45.537, -122.645]])
  }).fitWorld();

  // Can use other maps. Adds attribution to currently used map - openstreetmaps.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // Move zoom controls to bottom right of map.
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  let curr_pos, curr_acc; // Used to track user location.

  // If location found, delete previous location marker and set new marker.
  function onLocationFound(e) {
    const radius = e.accuracy;

    if (curr_pos) {
      map.removeLayer(curr_acc);
      map.removeLayer(curr_pos);
    }

    curr_pos = L.marker({ lat: e.coords.latitude, lng: e.coords.longitude }).addTo(map);
    curr_acc = L.circle({ lat: e.coords.latitude, lng: e.coords.longitude }, radius).addTo(map);
  }
  map.on("locationfound", onLocationFound);

  // If not found, send console error. A few errors are to be expected.
  function onLocationError(e) {
    console.error("Location found error:", e.message);
    alert("Unable to retrieve your location.");
  }

  // Uses browser location data. Gets called as user location data changes (i.e. it's live data).
  navigator.geolocation.watchPosition(onLocationFound, onLocationError, {
    maximumAge: 1000,
    timeout: 2000
  });

  // Initialize location to PSU Campus
  map.setView(L.latLng(45.5118, -122.6843), 16);

  // This loads the markers' data from a JSON file, then places the markers on the map
  async function placeMarkers() {
    const url = "map/markers.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const locations = await response.json();
      locations.forEach(({ position, content, name, aliases }) => {
        const marker = L.marker(position).addTo(map);
        // Store the marker instance in leafletMarkers
        leafletMarkers[name.toLowerCase()] = marker;
        aliases.forEach(alias => {
          leafletMarkers[alias.toLowerCase()] = marker;
        });

        marker.on("click", function () {
          openside(content);
        });

        // Store marker data for searching
        markers[name.toLowerCase()] = { position, content, marker };
        aliases.forEach(alias => {
          markers[alias.toLowerCase()] = { position, content, marker };
        });
      });
      console.log('Markers loaded:', markers);
    } catch (error) {
      console.error("Error loading markers:", error.message);
    }
  }
  placeMarkers();
};
loadMap("map");

// These handle onclick actions for the sidebar.
function openside(content) {
  const x = matchMedia("(max-width: 768px)");
  changeWidth(x);

  // Watch for browser size changes, including if user flips phone.
  x.addEventListener("change", function () {
    if (document.getElementById("mapSide").style.width !== "0%") {
      changeWidth(x);
    }
  });

  // Adds clickable social media links to the bottom of each marker.
  let pageurl = 'https://ahmadsafa21.github.io/Interactive-map-web-app/';
  content = content.slice(0, -6) + `<p style="display:flex; justify-content:space-around;"><a href="http://twitter.com/share?text=learn%20more&url=${pageurl}&hashtags=JasonWashington"><img src="./../media/icons8-twitterx-32.png" style="width:32px;height32px;"/></a>`
                                 + `<a href="https://www.facebook.com/sharer.php?u=${pageurl}"><img src="./../media/icons8-facebook-48.png" style="width:32px;height32px;" /></a>`
                                 + `<a href="https://www.linkedin.com/shareArticle?mini=true&url=${pageurl}"><img src="./../media/icons8-linkedin-48.png" style="width:32px;height32px;"/></a></p>`
                                 + content.slice(-6);
 
  console.log(content);
  document.getElementById("sidecontent").innerHTML = content;
}

// Called by button in index.html and handles the closing of the button.
function closeside() {
  // Hide side panel.
  document.getElementById("mapSide").style.width = "0%";

  // Empties sidepanel content.
  setTimeout(function () { document.getElementById("sidecontent").innerHTML = ""; }, 500);
}

// Called by openside to change the width of the side panel depending on screen size.
function changeWidth(x) {
  if (x.matches) {  // If screensize < 768px
    document.getElementById("mapSide").style.width = "100%";
  } else {
    document.getElementById("mapSide").style.width = "40%";
  }
}

// Function to search for a marker
function searchMarker() {
  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  const markerData = markers[input];
  if (markerData) {
    if (map.flyTo) {
      // Fly to the marker position
      map.flyTo(markerData.position, 16); // Adjust zoom level as needed
      // Simulate click on the marker
      markerData.marker.fire('click');
    } else {
      console.error('flyTo method is not available.');
    }
  } else {
    alert('Marker not found. Try different keywords.');
  }
}
