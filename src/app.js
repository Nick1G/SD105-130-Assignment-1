const APIKey = '176e29a31996dac45b61c17713b398de';

let userLong;
let userLat;

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    userLong = position.coords.longitude;
    userLat = position.coords.latitude;
  });
} else {
  alert(`Can't find your location!`);
}