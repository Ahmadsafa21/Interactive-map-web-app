// FLAGS
const DEBUG = false
const USER_LOCATION = false // ask user for location on start


/*
This section creates the map.
*/
var map = L.map("map").fitWorld();

//Can use other maps.
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution: "© OpenStreetMap",
}).addTo(map);


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


/*
Set initial location to PSU campus
*/
map.setView(L.latLng(45.51,-122.68), 16)


/*
This is responsible for making interactive markers.
*/
const locations = [
	{
		position: [45.51, -122.68],
		content: `<img src='media/TEMP/dui-food-serving-vessel.jpg' width='300' height:'300'>`,
	},
	{
		position: [45.51, -122.685],
		content: `<img src='media/TEMP/hu-wine-container.jpg' width='300' height:'300'>`,
	},
	{
	position: [45.515, -122.685],
	content: `<img src='media/TEMP/chicken.jpg' width='500' height='500'>`,
	},
];

locations.forEach(({ position, content }) => {
	var marker = L.marker(position).addTo(map);

	//Recommend using .on with "click" event for our project.
	marker.bindPopup(content);
});
