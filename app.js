const BETTER_DOCTOR_ENDPOINT = 'https://api.betterdoctor.com/2016-03-01/doctors?';

function callToBetterDoctorAPI(location, callback) {
  const query = {
    location: `${location}`,
    user_key: ‘bd89718570bb0b867674b0c0788273da’
  };
  $.getJSON(BETTER_DOCTOR_ENDPOINT, query, callback);
  console.log(callback);
}



const GOOGLE_MAPS_ENDPOINT = 'https://www.google.com/maps/embed/v1/place?'

function callToGoogleMaps(zipcode, callback) {
	const query = {
		key: ‘AIzaSyD-qzjAThO4iRO0-WdTHV-VTFQ3e_tsQOg’
	};
	$.getJSON(GOOGLE_MAPS_ENDPOINT, query, callback);
}


function renderDivToHTML(docImg, doc) {
	return `
		<div class='display-of-doctors'>
			<div class='doctor-profile'>

			</div>
		</div>
	`;
}