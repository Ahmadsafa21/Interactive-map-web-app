// FLAGS
const DEBUG = false;
const USER_LOCATION = false; // ask user for location on start

/*
This section creates the map.
*/
var map = L.map("map").fitWorld();

//Can use other maps.
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// Initialize location to PSU Campus
map.setView(L.latLng(45.51, -122.68), 16);

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
    position: [45.51, -122.68],
    content: `<img src='map/media/TEMP/dui-food-serving-vessel.jpg'>
		<div>The cat (Felis catus), commonly referred to as the domestic cat or house cat, is a small domesticated carnivorous mammal. It is the only domesticated species of the family Felidae. Recent advances in archaeology and genetics have shown that the domestication of the cat occurred in the Near East around 7500 BC. It is commonly kept as a house pet and farm cat, but also ranges freely as a feral cat avoiding human contact. It is valued by humans for companionship and its ability to kill vermin. Its retractable claws are adapted to killing small prey like mice and rats. It has a strong, flexible body, quick reflexes, sharp teeth, and its night vision and sense of smell are well developed. It is a social species, but a solitary hunter and a crepuscular predator. Cat communication includes vocalizations like meowing, purring, trilling, hissing, growling, and grunting as well as cat body language. It can hear sounds too faint or too high in frequency for human ears, such as those made by small mammals. It secretes and perceives pheromones.</div>`,
  },
  {
    position: [45.51, -122.685],
    content: `<img src='map/media/TEMP/hu-wine-container.jpg'>
		<div>The cat (Felis catus), commonly referred to as the domestic cat or house cat, is a small domesticated carnivorous mammal. It is the only domesticated species of the family Felidae. Recent advances in archaeology and genetics have shown that the domestication of the cat occurred in the Near East around 7500 BC. It is commonly kept as a house pet and farm cat, but also ranges freely as a feral cat avoiding human contact. It is valued by humans for companionship and its ability to kill vermin. Its retractable claws are adapted to killing small prey like mice and rats. It has a strong, flexible body, quick reflexes, sharp teeth, and its night vision and sense of smell are well developed. It is a social species, but a solitary hunter and a crepuscular predator. Cat communication includes vocalizations like meowing, purring, trilling, hissing, growling, and grunting as well as cat body language. It can hear sounds too faint or too high in frequency for human ears, such as those made by small mammals. It secretes and perceives pheromones.</div>`,
  },
  {
    position: [45.515, -122.685],
    content: `<img src='map/media/TEMP/chicken.jpg'>
		<div>The cat (Felis catus), commonly referred to as the domestic cat or house cat, is a small domesticated carnivorous mammal. It is the only domesticated species of the family Felidae. Recent advances in archaeology and genetics have shown that the domestication of the cat occurred in the Near East around 7500 BC. It is commonly kept as a house pet and farm cat, but also ranges freely as a feral cat avoiding human contact. It is valued by humans for companionship and its ability to kill vermin. Its retractable claws are adapted to killing small prey like mice and rats. It has a strong, flexible body, quick reflexes, sharp teeth, and its night vision and sense of smell are well developed. It is a social species, but a solitary hunter and a crepuscular predator. Cat communication includes vocalizations like meowing, purring, trilling, hissing, growling, and grunting as well as cat body language. It can hear sounds too faint or too high in frequency for human ears, such as those made by small mammals. It secretes and perceives pheromones.</div>`,
  },
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
  //Reveal side panel.
  document.getElementById("mySide").style.width = "40%";
  document.getElementById("sidecontent").innerHTML = content;
}

// called by button in map.html
function closeside() {
  //Hide side panel.
  document.getElementById("mySide").style.width = "0%";

  //This prevents the panel from removing content before sliding panel was gone.
  sleep(0.5);
  document.getElementById("sidecontent").innerHTML = "";
}

//Navigation bar
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links li");

burger.addEventListener("click", () => {
  nav.classList.toggle("nav-active");

  navLinks.forEach((link, index) => {
    if (link.style.animation) {
      link.style.animation = "";
    } else {
      link.style.animation = `navLinksFade 0.5s ease forwards ${
        index / 7 + 0.4
      }s`;
    }
  });
  burger.classList.toggle("toggle");
});
