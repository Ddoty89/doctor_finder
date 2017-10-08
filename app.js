const state = {
  userLat: {},
  userLng: {},
  selectedJob: '',
  practicesOfSelectedJob: [],
};

function callToBetterDoctorAPI(lat, lng) {
  let BETTER_DOCTOR_ENDPOINT = `https://api.betterdoctor.com/2016-03-01/practices?location=${lat},${lng},20&sort=distance-asc&skip=0&limit=10&user_key=bd89718570bb0b867674b0c0788273da`;
  $.get(BETTER_DOCTOR_ENDPOINT, function (data) {
    pushDoctorsWhichJobsMatchSelected(data);
  });
}

function handleDoctorJobSelection() {
  $('#jobs').change(function() {
    let selectedJob = $('#jobs option:selected').text();
    console.log(selectedJob);
    if(selectedJob === '') {
      state.selectedJob == false; 
    } else {
      state.selectedJob = selectedJob;
    }
  });
}

function pushDoctorsWhichJobsMatchSelected(apiResults) {
  apiResults.data.forEach(result => {
    result.doctors.forEach(doctor => {
      doctor.specialties.forEach(skill => {
        if(skill.actor === state.selectedJob) {
          state.practicesOfSelectedJob.push(result);
        }
      });
    });
  });
  createMarkers(state.practicesOfSelectedJob);
}

function findCurrentLocationButton() {
  $('.js-current-location').on('click', function(event) {
    $('.map').removeClass('hidden');
    $('.specialty-header').removeClass('hidden');
    initMap();
  });
}

function findUserPosition() {
navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      state.userLat = pos.lat;
      state.userLng = pos.lng;

      infoWindow.setPosition(pos);
      infoWindow.setContent('Current Location');
      infoWindow.open(map);
      map.setCenter(pos);
      
      callToBetterDoctorAPI(state.userLat, state.userLng);
      
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
}


var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.8781, lng: -87.6298},
    zoom: 11
  });
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    findUserPosition();
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

function createMarkers(practices) {
  
  let locationOfPractices = [];
  practices.forEach(location => {
    
    console.log(location.phones)
    console.log(location.phones[0].type)
    console.log(location.phones[0].number)
    
    const locationName = location.name;
    const locationStreetAddress = location.visit_address.street;
    const locationCity = location.visit_address.city;
    const locationState = location.visit_address.state;
    let locationPhoneNumber = '';
    for(let j = 0; j < location.length; j++) {
      if(location.phones[i].type === 'landline') {
        locationPhoneNumber = location.phones[i].number;
      } else {
        locationPhoneNumber = 'No number provided';
      }
    }
    let ifPracticeAcceptingNewPatients = '';
    if(location.accepts_new_patients === true) {
      ifPracticeAcceptingNewPatients = 'Accepting new patients';
    } else {
      ifPracticeAcceptingNewPatients = 'Not accepting new patients';
    }
    locationOfPractices.push(`<strong>${locationName}</strong><br>
                              ${locationStreetAddress}<br>
                              ${locationCity}, ${locationState}<br>              
                              ${ifPracticeAcceptingNewPatients}<br>
                              ${locationPhoneNumber}`);
    locationOfPractices.push(location.lat);
    locationOfPractices.push(location.lon);
  });  
  
let infowindow = new google.maps.InfoWindow({});

let marker, i;

  for (i = 0; i < locationOfPractices.length; i+=3) {
    let marker = new google.maps.Marker({
          position: new google.maps.LatLng(locationOfPractices[i+1],locationOfPractices[i+2]),
          map: map
        });

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(locationOfPractices[i]);
        infowindow.open(map, marker);
      };
    })(marker, i));
  }
}


    

// function renderDivToHTML(docImg, doc) {
//  return `
//    <div class='display-of-doctors'>
//      <div class='doctor-profile'>

//      </div>
//    </div>
//  `;
// }







$(handleDoctorJobSelection);
$(findCurrentLocationButton);




