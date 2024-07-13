//This function creates the map.
var loadMap = function (id) {
  
  //Create map, can't zoom in too much, and force users to stay in Portland.
  var map = L.map(id, {
    minZoom: 14,
    zoomControl: false,
    maxBounds: L.latLngBounds([[45.495, -122.724],[45.537, -122.645]])
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

  // Initialize location to PSU Campus
  map.setView(L.latLng(45.5118, -122.6843), 16);

  var curr_pos, curr_acc; //Used to track user location.

  //If location found, delete previous location marker and set new marker.

  function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map);
    //.bindPopup("You are within " + radius + " meters from this point")
    //.openPopup();

    L.circle(e.latlng, radius).addTo(map);
  }
  map.on("locationfound", onLocationFound);

  //If not found, send console error. A few errors are to be expected.

  function onLocationError(e) {
    alert(e.message);
  }

  //Uses browser location data. Gets called as user location data changes (i.e. it's live data).
  navigator.geolocation.watchPosition(onLocationFound, onLocationError, {
    maximumAge: 1000,
    timeout: 2000
  })
};
loadMap("map");



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


//These handle onclick actions for the sidebar.
function openside(content) {
	var x = matchMedia("(max-width: 768px)");
	changeWidth(x);
	
  //Watch for browser size changes, including if user flips phone.
	x.addEventListener("change", function() {
		if (document.getElementById("mapSide").style.width != "0%") {
			changeWidth(x);
		}
	})
	
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
