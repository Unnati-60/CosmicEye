// Scroll to top
const scrollToTop = document.querySelector('.scroll-to-top')
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTop.style.display = "grid"
    } else {
        scrollToTop.style.display = "none"
    }
})

// Slider
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 24,
    speed: 1000,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 2,
        }
    }
  });

//   Aos
AOS.init({
    duration: 1000,
    easing: "ease-in-out",
});

//Creating map
var mymap = L.map('map').setView([0, 0], 50);

// adding openstreetmap tiles to map (Mercator projection) 
var titleUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var tiles = L.tileLayer(titleUrl, { 
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'});

  tiles.addTo(mymap);

  // adding iss Marker
var issIcon = L.icon({
  iconUrl: './assets/images/issIcon.png',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});


var marker = L.marker([0, 0], {icon: issIcon});
marker.addTo(mymap);


function updateISSLocation() {
  fetch('http://api.open-notify.org/iss-now.json')
    .then(response => response.json())
    .then(data => {
      var latitude = data.iss_position.latitude;
      var longitude = data.iss_position.longitude;
      marker.setLatLng([latitude, longitude]);
      mymap.setView([latitude, longitude], 2);
      const issDataDiv = document.getElementById('latlong');
    issDataDiv.innerHTML = `
      <p style="text-align:right">Lat: ${latitude} Long: ${longitude}</p>
    `;
    })
    .catch(error => console.log(error));
}

// calling updating location at every 5 second
updateISSLocation();
setInterval(updateISSLocation, 5000);

fetch('http://api.open-notify.org/astros.json')
  .then(response => response.json())
  .then(data => {
    const numberOfPeople = data.number;
    const peopleNames = data.people.map(person => person.name);

    const issDataDiv = document.getElementById('iss-data');
    issDataDiv.innerHTML = `
      <p style="text-align:right">There are currently ${numberOfPeople} people at the ISS.</p>
      <p style="text-align:right">Their names are: <br>${peopleNames.join(', ')}.</p>
    `;
  })
  .catch(error => console.error(error));

