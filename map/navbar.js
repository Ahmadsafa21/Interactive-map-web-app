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
      link.style.animation = `navLinksFade 0.5s ease forwards ${index / 7 + 0.4
        }s`;
    }
  });
  burger.classList.toggle("toggle");
});


document.addEventListener('DOMContentLoaded', function () {
  // Event listener for the search button click
  document.getElementById('searchButton').addEventListener('click', searchMarker);

  // Event listener for pressing Enter in the search input field
  document.getElementById('searchInput').addEventListener('keyup', function (event) {
    if (event.key === "Enter") {  // Checks if the key pressed is the Enter key
      searchMarker();          // Calls the searchMarker function
    }
  });
});

