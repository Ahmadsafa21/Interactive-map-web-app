/*
This section creates the map.
*/
var loadMap = function (id) {
  var map = L.map(id, {
    minZoom: 14,
    zoomControl: false,
    maxBounds: L.latLngBounds([[45.495, -122.724],[45.537, -122.645]])
  }).fitWorld();

  //Can use other maps.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  // Initialize location to PSU Campus
  map.setView(L.latLng(45.5118, -122.6843), 16);

  /*
  This section asks users for their location.
  */
  var curr_pos, curr_acc;

  function onLocationFound(e) {
    //console.log("Location found.")
    //console.log(e)

    var radius = e.accuracy;

    if (curr_pos){
      map.removeLayer(curr_acc);
      map.removeLayer(curr_pos);
    }

    curr_pos = L.marker({lat: e.coords.latitude, lng: e.coords.longitude}).addTo(map)
    curr_acc = L.circle({lat: e.coords.latitude, lng: e.coords.longitude}, radius).addTo(map);
  }

  function onLocationError(e) {
    console.error("Location found error.")
  }

  //Uses browser location data.
  navigator.geolocation.watchPosition(onLocationFound, onLocationError, {
    maximumAge: 100,
    timeout: 200
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


/*
These handle onclick actions for the sidebar.
*/
function openside(content) {
	var x = matchMedia("(max-width: 768px)");
	changeWidth(x);
	
	x.addEventListener("change", function() {
		if (document.getElementById("mapSide").style.width != "0%") {
			changeWidth(x);
		}
	})
	
	document.getElementById("sidecontent").innerHTML = content;
}

//Called by button in index.html and handles the closing of the button.
function closeside() {
	document.getElementById("mapSide").style.width = "0%";
	
	setTimeout(function() {document.getElementById("sidecontent").innerHTML = ""; }, 500)
}

//Called by openside to change the width of the side panel depending on screen size.
function changeWidth (x) {
	if (x.matches) {	//If screensize < 768px
		document.getElementById("mapSide").style.width = "100%";
	} else {
		document.getElementById("mapSide").style.width = "40%";
	}
}


