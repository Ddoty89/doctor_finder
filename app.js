// const BETTER_DOCTOR_ENDPOINT = 'https://api.betterdoctor.com/2016-03-01/doctors?';

// function callToBetterDoctorAPI(location, callback) {
//   const query = {
//     location: `${location}`,
//     user_key: ‘bd89718570bb0b867674b0c0788273da’
//   };
//   $.getJSON(BETTER_DOCTOR_ENDPOINT, query, callback);
//   console.log(callback);
// }



var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.8283, lng: -98.5795},
    zoom: 6
  });
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Current Location');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}



// function renderDivToHTML(docImg, doc) {
// 	return `
// 		<div class='display-of-doctors'>
// 			<div class='doctor-profile'>

// 			</div>
// 		</div>
// 	`;
// }


// function callDataFromBetterDoctors(dataResult) {

// }







// $(findCurrentLocation);


$(initMap);

