const APIKey = '176e29a31996dac45b61c17713b398de';
const APICall = 'https://api.openweathermap.org/data/2.5/'

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    let userLong = position.coords.longitude;
    let userLat = position.coords.latitude;
    return new Promise((resolve) => {
      resolve(renderCurrentWeather(userLong, userLat), renderForecast(userLong, userLat));
    });
  });

} else {
  alert(`Can't find your location!`);
}

function fixDateToWeekday(date) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const newDate = new Date(date).getDay();
  return weekdays[newDate];
}

function getToday() {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const dateToday = `${year}-${month}-${day}`;
  return dateToday;
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

function renderForecast(long, lat) {
  const forecastEl = document.querySelector('.forecast');
  const today = getToday();
  console.log(today);

  document.querySelectorAll('.day').forEach(day => {
    // day.remove();
  });

  return fetch(`${APICall}forecast?lat=${lat}&lon=${long}&units=metric&appid=${APIKey}`)
  .then(response => response.json())
  .then(data => {

    data.list.forEach(forecast => {
      if (!forecast.dt_txt.includes(today)) {
        const weekday = fixDateToWeekday(forecast.dt_txt);
        console.log(forecast);
        // forecastEl.insertAdjacentHTML('beforeend', `
        //   <div class="day">
        //     <h3>${weekday}</h3>
        //     <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" />
        //     <div class="description">${forecast.weather[0].description}</div>
        //     <div class="temp">
        //       <span class="high">${forecast.main.temp_max}</span>/<span class="low">${forecast.main.temp_min}</span>
        //     </div>
        //   </div>`);
      }
    });
  });
}