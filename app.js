const state = {
  selectedJobText: '',
  selectedJobVal: '',
  locationOfPractices: [],
  selectedJobCategories: [
    
    {ALG: ['Allergist',
    'Otolaryngic Allergist',
    'Pediatric Allergist']},
    
    {CHR: ['Chiropractor',
    'Pediatric Chiropractor',
    'Sports Chiropractor']},
    
    {DEN: ['Dentist',
    'Orthodontist',
    'Pediatric Dentist']},
    
    {DIE: ['Dietitian']},
    
    {ENT: ['Ear, Nose and Throat Doctor']},
    
    {FAM: ['Family Medicine Adolescent Medicine',
    'Family Nurse Practitoner',
    'General Nurse Practitoner',
    'General Practitoner']},
    
    {PED: ['Adolescent Medicine Pediatrician',
    'Pediatric Dentist',
    'Pediatric Ear, Nose and Throat Doctor',
    'Pediatrician',
    'Pediatric Nurse Practitoner',
    'Pediatric Physical Therapy']},
    
    {PT: ['Physical Therapist',
    'Sports Physical Therapist']},
    
    {MH: [ 'Adult Psychologist',
    'Art Therapist',
    'Clinical Psychologist',
    'Cognitive & Behavioral Psychologist',
    'Counceling Psychologist',
    'Counselor',
    'Family Psychologist',
    'Mental Health Counselor',
    'Mental Health Nurse Practitoner',
    'Professional Counselor',
    'Psychiatrist',
    'Psychoanalysts',
    'Psychologist' ]},
    
    {MHA: ['Addiction Counselor',
    'Addiction Psychiatrist',
    'Addiction Psychologist',
    'Addiction Specialist',
    'Family Medicine Addiction Medicine',
    'Psychiatry & Neurology Addiction Medicine']},
    
    {WH: ['Gynecologist',
    'OBGYN',
    'OBGYN Nurse Practitoner',
    'Obstetrician',
    'Women\'s Health Nurse Practitoner']}
    ]
};

function handleDoctorJobSelection() {
  $('#jobs').change(function() {
    let selectedJobText = $('#jobs option:selected').text();
    let selectedJobVal = $('#jobs option:selected').val();
      $('.selected-job').text(selectedJobText);
      state.selectedJobText = selectedJobText;
      state.selectedJobVal = selectedJobVal;
  });
}

function findCurrentLocationButton() {
  $('.js-current-location').on('click', function(event) {
    $('.map').removeClass('hidden');
    $('.specialty-header').removeClass('hidden');
    $('.js-new-search').removeClass('hidden');
    $('.js-dropdown').addClass('hidden');
    $('.js-user.input').addClass('hidden');
    $('.js-search-init').addClass('hidden');
    initMap();
  });
}

function callToBetterDoctorAPI(lat, lng) {
  let BETTER_DOCTOR_ENDPOINT = `https://api.betterdoctor.com/2016-03-01/practices?location=${lat},${lng},25&sort=distance-asc&skip=0&limit=50&user_key=bd89718570bb0b867674b0c0788273da`;
  $.get(BETTER_DOCTOR_ENDPOINT, function (data) {
    pushDoctorsWhichJobsMatchSelected(data);
  });
}

function pushDoctorsWhichJobsMatchSelected(apiResults) {
  let arrayOfJobTitlesThatMatchOptionValue = [];
  state.selectedJobCategories.forEach(jobValues => {
    Object.keys(jobValues).forEach(keyAsString => {
      if(keyAsString === state.selectedJobVal) {
        arrayOfJobTitlesThatMatchOptionValue = jobValues[state.selectedJobVal];
      }
    });
  });
  
  let practicesOfSelectedJob = [];
  apiResults.data.forEach(result => {
    result.doctors.forEach(doctor => {
      doctor.specialties.forEach(skill => {
          if(arrayOfJobTitlesThatMatchOptionValue.indexOf(skill.actor) > -1) {
            if(practicesOfSelectedJob.indexOf(result) <= -1) {
              practicesOfSelectedJob.push(result);
            }
          }
        });
      });
    });
    createMarkers(practicesOfSelectedJob);
}

function findUserPosition() {
  navigator.geolocation.getCurrentPosition(function(position) {
  callToBetterDoctorAPI(position.coords.latitude, position.coords.longitude)
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
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

  var geolocationDiv = $('.js-current-location')[0];
  var geolocationControl = new GeolocationControl(geolocationDiv, map);
  
  if (navigator.geolocation) {
    findUserPosition();
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}


function GeolocationControl(controlDiv, map) {
    google.maps.event.addDomListener(controlDiv, 'click', findUserPosition);
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function createMarkers(practices) {
  practices.forEach(location => {
    const locationName = location.name;
    const locationStreetAddress = location.visit_address.street;
    const locationCity = location.visit_address.city;
    const locationState = location.visit_address.state;
    let locationPhoneNumber = '';
    location.phones.forEach(officeNumbers => {
      if(officeNumbers.type === 'landline') {
        locationPhoneNumber = officeNumbers.number;
      } else if(officeNumbers.type === 'business_landline') {
        locationPhoneNumber = officeNumbers.number;
      } else {
        locationPhoneNumber = 'No phone number provided';
      }
    });
    let ifPracticeAcceptingNewPatients = '';
    if(location.accepts_new_patients === true) {
      ifPracticeAcceptingNewPatients = 'Accepting new patients';
    } else {
      ifPracticeAcceptingNewPatients = 'Not accepting new patients';
    }
    state.locationOfPractices.push(`<strong>${locationName}</strong><br>
                              ${locationStreetAddress}<br>
                              ${locationCity}, ${locationState}<br>              
                              ${ifPracticeAcceptingNewPatients}<br>
                              ${locationPhoneNumber}<br>`);
    state.locationOfPractices.push(location.lat);
    state.locationOfPractices.push(location.lon);
  });  
  renderPracticesToHTML(state.locationOfPractices);
let infowindow = new google.maps.InfoWindow({});

let marker, i;

  for (i = 0; i < state.locationOfPractices.length; i+=3) {
    let marker = new google.maps.Marker({
          position: new google.maps.LatLng(state.locationOfPractices[i+1],state.locationOfPractices[i+2]),
          animation: google.maps.Animation.DROP,
          map: map
        });

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(state.locationOfPractices[i]);
        infowindow.open(map, marker);
      };
    })(marker, i));
  }
}

function renderPracticesToHTML(practices) {
  for(let i = 0; i < practices.length; i+=3) {
    $('.display-of-doctors').append(`<li class ='js-list-of-offices'>${practices[i]}</li>`);
    $('.display-of-doctors').removeClass('hidden');
  }
}

function startNewSearchButton() {
  $('.js-new-search').click(function(event) {
    location.reload();
  })
}



$(handleDoctorJobSelection);
$(findCurrentLocationButton);
$(startNewSearchButton);
