// FLAGS
const DEBUG = false;
const USER_LOCATION = false; // ask user for location on start

/*
This section creates the map.
*/
var map = L.map("map", {
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
if (USER_LOCATION) {
  map.locate({ setView: true, maxZoom: 15 });
  function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map);
    //.bindPopup("You are within " + radius + " meters from this point")
    //.openPopup();

    L.circle(e.latlng, radius).addTo(map);
  }
  map.on("locationfound", onLocationFound);

  /*
This section handles failing to get user location.
*/
  function onLocationError(e) {
    alert(e.message);
  }
  map.on("locationerror", onLocationError);
}
//end USER_LOCATION flag

async function placeMarkers() {
  const url = "map/markers.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    locations = locationsJson = await response.json();
    console.log(locations)
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





// fetch("map/markers.json")
//   .then(response => response.json)
//   .then(json => console.log(json));


/*
This loads the markers' data from a JSON file, then places the markers on the map
*/
// document.addEventListener("DOMContentLoaded", () => {
//     // fetch('map/markers.json', {mode : 'no-cors'}) //using this causes the fetch to fail for some reason. no-cors issue?
//     fetch('map/markers.json') //using this gives a cors error
//         .then(response => {
//           if (!response.ok){
//             throw new Error("response not ok");
//           }
//           return response.json();
//         })
//         .then(console.log)
//         .then(data => {
//             const locations = data;
//             console.log(locations);

//             //This places the markers on the map and changes the onclick behavior.
//             locations.forEach(({ position, content }) => {
//               var marker = L.marker(position).addTo(map);
//               marker.on("click", function () {
//                 openside(content);
//                 });
//             });
//         })
//         .catch(error => console.error('Error fetching JSON:', error));
// });

/*
These handle onclick actions for the sidebar.
*/
function openside(content) {
	//Checks screensize and call changewidth.
	var x = matchMedia("(max-width: 768px)");
	changeWidth(x);
	
	//If user changes screensize while sidepanel is open.
	x.addEventListener("change", function() {
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


