// FLAGS
const DEBUG = false;
const USER_LOCATION = false; // ask user for location on start

/*
This section creates the map.
*/
var map = L.map("map", {
  minZoom: 14,
  zoomControl: false,
  maxBounds: L.latLngBounds([[45.495, -122.724], [45.537, -122.645]])
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

/*
These are the marker locations and content associated with them.
*/
const locations = [
  {
    // tree/marker
    position: [45.50990, -122.68458],
    content: `<img src='media/accountability marker.jpg'>
	<img src='media/memorial_tree.jpg'>
	<div>
    <p>Washington Family Memorial Tree and PSU Accountability Marker</p>
    <p>Immediately following the shooting death of Jason Washington, the members of his family marked the spot on SW College Street near Broadway.  Jason had been on the ground near the tree on the south side of the street.  The family decorated the tree and made it a living memorial for the many, many people who pass on that street everyday, especially for the PSU Students who lived in the Broadway Building and whose back exit faces the tree.  The tree is sometimes adorned with holiday decorations that change with the seasons.  Family members also leave remembrances and messages for Jason attached to the tree.  The location, marked by the tree, has since 2018 served as a site for activism, marches, vigils and other commemorative events connected to Jason’s memory.</p>
    <p>Guided by family member Kayla Washington, the university’s memorial art committee created a permanent accountability marker at the location.  The marker states in very plain language the actions of PSU campus police that ended Jason Washington’s life on the night of June 29, 2018 as to leave no doubt as to how he died.  The marker also features a rendering of the tree, honoring the family’s dedication to memorializing their loved one.</p>
    <p><a href=https://www.pdx.edu/jason-washington-art-committee target='_blank'>Learn more about the Memorial Art Committee</a></p>
	</div>`
  },
  {
    // cheerful tortiose
    position: [45.51013, -122.68376],
    content: `<img src='media/Cheerful_Tortoise.jpg'>
	<div>
    <p>The Cheerful Tortoise neighborhood pub has been a staple location for PSU students, faculty and staff since the mid-1960s.  Many threads of university history thread through the Cheerful Tortoise, from celebrations, meetings, and even the teaching of courses.  The Cheerful Tortoise figures in the story of Jason Washington’s life as it was the last establishment he and his friends visited before their fateful encounter with campus police on SW College Street just outside its door. </p>
    <p><a href=https://cheerfultortoise.com/ target='_blank'>Cheerful Tortoise's website</a></p>
    </div>`
  },
  {
    //  millar library
    position: [45.51162, -122.68604],
    content: `<img src='media/Special_Collections_Image.jpg'>
	<div>
    <audio controls>
      <source src="media/Special Collections Description for Interactive Map.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
    </audio>
    <p>Jason Washington Memorial Archive for Justice</p>
    <p>Millar Library’s Special Collections department is home to a new body of materials: The Jason Washington Memorial Archive for Justice.</p>
    <p>This collection is an ongoing project by student researchers begun in memory of Jason Washington (1973-2018) who was shot by Portland State University police. Our mission is to document the life of Jason Washington, a Navy veteran and resident of the neighborhood, a postal worker, father, and husband.  The project aims to foster teaching, research, and service to preserve Jason Washington’s memory and to advance activism for racial justice on campus and in the community.</p>
    <p><a href='https://library.pdx.edu/research/special-collections-university-archives/' target='_blank'>Learn more about the special collection.</a></p>
    </div>`
  },
  {
    // SMSU mural
    position: [45.51190, -122.68426],
    content: `<img src='media/Kyra_Watkins_Muralist.jpg'>
	<div>
    <p>Local muralist Kyra Watkins served as artist in residence during the academic year 2023-24. She was selected by the Washington family and the memorial committee to complete an artistic biographical remembrance of Jason for installation in the second floor mezzanine of the Smith Memorial Student Union on the Portland State University campus.  Kyra Watkins is a highly experienced muralist and an expert portraitist, truly gifted in rendering the face and expressiveness.  The mural measures 12 x 10 and its design was inspired by the artist’s many interactions with the Washington family during her residency as well as by numerous photos, videos, and remembrances of Jason in life.</p>
	<a href='media/Kyra_Watkins_Interview.pdf'>Download Interview</a>
	<embed src='media/Kyra_Watkins_Interview.pdf' type='application/pdf' class='responsive' width="100%" height="100%">
    </div>`
  },
  {
    // CPSO
    position: [45.51218, -122.68328],
    content: `<img src='media/2024.05.23_CPSO_sign_3.jpeg'>
	<div>
    <p>Campus Public Safety Office</p>
    <p>From its ground-breaking in 1966, this building was called Koinonia House.  It was owned by Portland Campus Ministries, a consortium of eight different denominations that did outreach and service provision to the campus and the neighborhood.  In the 1970s, Koinonia housed services for military veterans and it has also served as classroom space.  PSU purchased the building in 2006, part of its long-term plan to grow eastward from the south park blocks in downtown and develop a “university district.”  Since 2012, the building has served as the campus public safety office.  In September, 2018, student activists camped in front of CPSO for two weeks in protest of the shooting of Jason Washington in June of that year.  Montgomery Street between SW Broadway and 6th Avenues was closed to traffic and turned into a pedestrian mall around 2019, and is the site of frequent events, gatherings, demonstrations, and other campus-related activities.</p>
    </div>`
  }
];

/*
This places the markers on the map and changes the onclick behavior.
*/
locations.forEach(({ position, content }) => {
  var marker = L.marker(position).addTo(map);

  marker.on("click", function () {
    openside(content);
  });
});

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
