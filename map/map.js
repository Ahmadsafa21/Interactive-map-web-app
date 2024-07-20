//This function creates the map.

var map;

var loadMap = function (id) {
  
  //Create map, can't zoom in too much, and force users to stay in Portland.
  var map = L.map(id, {
    minZoom: 14,
    zoomControl: false,
    //maxBounds: L.latLngBounds([[45.495, -122.724],[45.537, -122.645]])
  }).fitWorld();

  //Can use other maps. Adds attribution to currently used map - openstreetmaps.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  //Move zoom controls to bottom right of map.
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  var curr_pos, curr_acc; //Used to track user location.

  //If location found, delete previous location marker and set new marker.
  function onLocationFound(e) {
    var radius = e.accuracy;

    if (curr_pos) {
      map.removeLayer(curr_acc)
      map.removeLayer(curr_pos)
    }
    var userLatLng = L.latLng(45.5118, -122.6843)
    curr_pos = L.marker({lat: userLatLng.lat, lng: userLatLng.lng}).addTo(map);
    curr_acc = L.circle({lat: userLatLng.lat, lng: userLatLng.lng}, radius).addTo(map);
  }
  map.on("locationfound", onLocationFound);

  //If not found, send console error. A few errors are to be expected.
  function onLocationError(e) {
    console.log("Location found error.");
  }

  //Uses browser location data. Gets called as user location data changes (i.e. it's live data).
  navigator.geolocation.watchPosition(onLocationFound, onLocationError, {
    maximumAge: 1000,
    timeout: 2000
  })

  // Initialize location to PSU Campus
  map.setView(L.latLng(45.5118, -122.6843), 16);

  /*
  This loads the markers' data from a JSON file, then places the markers on the map
  */
  async function placeMarkers() {
    const url = "map/markers.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      // markers are placed here
      locations = locationsJson = await response.json();
      locations.forEach(({ position, content }) => {
        var marker = L.marker(position).addTo(map);


        marker.on("click", function () {
          openside(content);
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  }
  placeMarkers()
  return map
};
map = loadMap("map");
//end USER_LOCATION flag

function getDirection(targetLat, targetLon, target) {
  helperGetDirection(targetLat, targetLon, target, map)
}

var arrowMarker = null;
function helperGetDirection(targetLat, targetLon, target, map) {
  map.on('locationfound', onLocationFound); // Attach the event listener
  map.locate(); // Trigger location finding
  function onLocationFound(e) {
    // Your existing logic here...
    var radius = e.accuracy;
    var userLatLng = L.latLng(45.5118, -122.6843);

    // Check if arrowMarker already exists
    if (arrowMarker !== null) {
      map.removeLayer(arrowMarker); // Remove existing marker
      arrowMarker = null; // Reset marker reference
    }
    // Your existing logic to add the arrow marker...
    var targetLatLng = L.latLng(targetLat, targetLon);
    var bearing = calculateBearing(userLatLng.lat, userLatLng.lng, targetLatLng.lat, targetLatLng.lng);
    var distance = calculateDistance(userLatLng.lat, userLatLng.lng, targetLatLng.lat, targetLatLng.lng);

    var ArrowIcon = L.DivIcon.extend({
        createIcon: function() {
            var div = document.createElement('div');
            div.innerHTML = '<div class="arrow-icon" style="transform: rotate(' + bearing + 'deg);"></div>';
            return div;
        }
    });
    var arrowIcon = new ArrowIcon();

    // Add the custom icon to the map and store reference
    arrowMarker = L.marker(userLatLng, { icon: arrowIcon }).addTo(map)
        .bindPopup("Distance to " + target + ": " + Math.round(distance) + " meters");
  }
  map.on("locationerror", function(e) {
    alert(e.message);
  });
}

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
