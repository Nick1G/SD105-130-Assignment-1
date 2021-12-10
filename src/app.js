const APIKey = '176e29a31996dac45b61c17713b398de';
const APICall = 'https://api.openweathermap.org/data/2.5/'

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    let userLong = position.coords.longitude;
    let userLat = position.coords.latitude;
    return new Promise((resolve) => {
      resolve(renderCurrentWeather(userLong, userLat));
    });
  });

} else {
  alert(`Can't find your location!`);
}

function renderCurrentWeather(long, lat) {
  const currentWeather = document.querySelector('.current-conditions');

  while (currentWeather.firstChild) {
    currentWeather.removeChild(currentWeather.firstChild);
  }

  return fetch(`${APICall}weather?lat=${lat}&lon=${long}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(data => {
      currentWeather.insertAdjacentHTML('afterbegin', `
        <h2>Current Conditions</h2>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
        <div class="current">
          <div class="temp">${data.main.temp}&#176;C</div>
          <div class="condition">${data.weather[0].description}</div>
        </div>`);
    });
}