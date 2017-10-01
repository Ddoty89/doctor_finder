const BETTER_DOCTOR_ENDPOINT = 'https://api.betterdoctor.com/2016-03-01/doctors?';

function callToBetterDoctorAPI(location, callback) {
  const query = {
    // location: `${location}`,
    user_key: ‘bd89718570bb0b867674b0c0788273da’
  };
  $.getJSON(BETTER_DOCTOR_ENDPOINT, query, callback);
  console.log(callback);
}
