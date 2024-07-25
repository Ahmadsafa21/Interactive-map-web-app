//This function creates the map.
var loadMap = function (id) {
  var map = L.map(id, {
    minZoom: 14,
    zoomControl: false,
    //maxBounds: L.latLngBounds([[45.495, -122.724],[45.537, -122.645]])
  }).fitWorld();

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  var curr_pos, curr_acc, destinationMarker; // Add destinationMarker and arrowLine
  var arrowMarker = null
  function onLocationFound(e) {
    var radius = e.accuracy;
    if (curr_pos) {
      map.removeLayer(curr_acc)
      map.removeLayer(curr_pos)
    }
   
    //curr_pos = L.marker({lat: e.coords.latitude, lng: e.coords.longitude}).addTo(map);
    //curr_acc = L.circle({lat: e.coords.latitude, lng: e.coords.longitude}, radius).addTo(map);
    
    var userLatLng = L.latLng(45.5118, -122.6843); // Example user location
    curr_pos = L.marker({lat: userLatLng.lat, lng: userLatLng.lng}).addTo(map);
    curr_acc = L.circle({lat: userLatLng.lat, lng: userLatLng.lng}, radius).addTo(map);

    // Update arrow if destinationMarker is set
    if(destinationMarker){
      drawArrow(curr_pos.getLatLng(), destinationMarker.position);
    }
  }

  function onLocationError(e) {
    console.log("Location found error.");
  }

  navigator.geolocation.watchPosition(onLocationFound, onLocationError, {
    maximumAge: 1000,
    timeout: 2000
  })

  map.setView(L.latLng(45.5118, -122.6843), 16);

  async function placeMarkers() {
    const url = "map/markers.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      locations = locationsJson = await response.json();
      locations.forEach(({ position, content }) => {
        var marker = L.marker(position).addTo(map);

        marker.on("click", function () {
          openside(content);
          destinationMarker = marker; // Set clicked marker as destination
          
          // Ensure curr_pos is a valid LatLng object before calling drawArrow
          if (curr_pos && curr_pos.getLatLng) {
            const userPos = curr_pos.getLatLng(); // Get the current position as an L.LatLng object
            drawArrow(userPos, marker.getLatLng()); // Pass LatLng objects to drawArrow
          }
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  // Function to draw/update arrow line
  function drawArrow(fromPosition, toPosition) {
    // Validate inputs
    if (!fromPosition || !toPosition || typeof fromPosition.lat === 'undefined' || typeof toPosition.lat === 'undefined') {
      console.error('Invalid positions provided to drawArrow');
      return;
    }
  
    // Ensure positions are L.LatLng objects
    const fromLatLng = L.latLng(fromPosition.lat, fromPosition.lng);
    const toLatLng = L.latLng(toPosition.lat, toPosition.lng);
    //Get distance and bearing for arrow to point in the right direction
    
    var distance = calculateDistance(fromLatLng.lat, fromLatLng.lng, toLatLng.lat, toLatLng.lng);
    var bearing = calculateBearing(fromLatLng.lat, fromLatLng.lng, toLatLng.lat, toLatLng.lng);
    if (arrowMarker !== null) {
      map.removeLayer(arrowMarker); // Remove existing marker
      arrowMarker = null; // Reset marker reference
    }

    //This is a poly line code 
  /*
    // Proceed with drawing the polyline
    if (arrowLine) {
      map.removeLayer(arrowLine); // Remove old arrow line
    }
    
    arrowLine = L.polyline([fromLatLng, toLatLng], {
      color: 'blue',
      weight: 5,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map)
    .bindPopup("Distance is " + Math.round(distance) + " meters");
    */

    var ArrowIcon = L.DivIcon.extend({
        createIcon: function() {
            var div = document.createElement('div');
            div.innerHTML = '<div class="arrow-icon" style="transform: rotate(' + bearing + 'deg);"></div>';
            return div;
        }
    });
    var arrowIcon = new ArrowIcon();
  
    // Add the custom icon to the map and store reference
    arrowMarker = L.marker(fromLatLng, { icon: arrowIcon }).addTo(map)
    .bindPopup("Distance is " + Math.round(distance) + " meters");
  }

  placeMarkers();
};

loadMap("map");
//end USER_LOCATION flag

//Calculate the bearing to point the arrow in the right direction
function calculateBearing(startLat, startLng, endLat, endLng) {
  const startLatRad = startLat * Math.PI / 180;
  const startLngRad = startLng * Math.PI / 180;
  const endLatRad = endLat * Math.PI / 180;
  const endLngRad = endLng * Math.PI / 180;

  const y = Math.sin(endLngRad - startLngRad) * Math.cos(endLatRad);
  const x = Math.cos(startLatRad) * Math.sin(endLatRad) - 
            Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(endLngRad - startLngRad);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180 / Math.PI + 360) % 360; // Convert to degrees and normalize
  return bearingDeg;
}

//Calculates the distance of the arrow to the target
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Radius of the Earth in meters
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}
/*
These handle onclick actions for the sidebar.
*/
function openside(content) {

  //Checks screensize and call changewidth.
  var x = matchMedia("(max-width: 768px)");
  changeWidth(x);

  //If user changes screensize while sidepanel is open.
  x.addEventListener("change", function () {
    if (document.getElementById("mapSide").style.width != "0%") {
      changeWidth(x);
    }
  })

  var contentDiv = document.createElement('div');
  contentDiv.innerHTML = content;

  // Create a button
  var button = document.createElement('button');
  button.textContent = 'Click Me'; // Button text
  button.onclick = function() { 
    alert('Button clicked!'); // Example action
  };

  // Append the button to the content div
  contentDiv.appendChild(button);

  //Assigns sidepanel content.
  document.getElementById("sidecontent").innerHTML = content;
}

//Called by button in index.html and handles the closing of the button.
function closeside() {

  //Hide side panel.
  document.getElementById("mapSide").style.width = "0%";

  //Empties sidepanel content.
  setTimeout(function () { document.getElementById("sidecontent").innerHTML = ""; }, 500)
}

//Called by openside to change the width of the side panel depending on screen size.
function changeWidth(x) {
  if (x.matches) {	//If screensize < 768px
    document.getElementById("mapSide").style.width = "100%";
  } else {
    document.getElementById("mapSide").style.width = "40%";
  }
}

function searchMarker() {
  var input = document.getElementById('searchInput').value.trim().toLowerCase();
  var marker = markers[input];
  if (marker) {
    map.setView(marker.getLatLng(), 17);  // Adjust the zoom level as needed
    marker.openPopup();
  } else {
    alert('Marker not found! Try different keywords.');
  }
}
