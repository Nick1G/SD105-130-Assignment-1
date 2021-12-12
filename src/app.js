const APICall = 'https://api.openweathermap.org/data/2.5/'

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    let userLong = position.coords.longitude;
    let userLat = position.coords.latitude;
    return new Promise((resolve) => {
      resolve(renderCurrentWeather(userLong, userLat), getForecast(userLong, userLat));
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
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const dateToday = `${year}-${month}-${day}`;
  return dateToday;
}

function renderCurrentWeather(long, lat) {
  const currentWeather = document.querySelector('.current-conditions');

  while (currentWeather.firstChild) {
    currentWeather.removeChild(currentWeather.firstChild);
  }

  document.querySelectorAll('.day').forEach(day => {
    day.remove();
  });

  return fetch(`${APICall}weather?lat=${lat}&lon=${long}&units=metric&appid=176e29a31996dac45b61c17713b398de`)
  .then(response => response.json())
  .then(data => {

    currentWeather.insertAdjacentHTML('afterbegin', `
      <h2>Current Conditions</h2>
      <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      <div class="current">
        <div class="temp">${data.main.temp}℃</div>
        <div class="condition">${data.weather[0].description}</div>
      </div>`);
  });
}

function getForecast(long, lat) {
  const today = getToday();

  return fetch(`${APICall}forecast?lat=${lat}&lon=${long}&units=metric&appid=176e29a31996dac45b61c17713b398de`)
  .then(response => response.json())
  .then(data => {
    let forecastDays = [];

    for (let i = 0; i < data.list.length; i++) {
      if (!data.list[i].dt_txt.includes(today)) {
        if (i === 0) {
          forecastDays.push(data.list[i]);
          
        } else if (data.list[i].dt_txt.split(' ')[0] === data.list[i - 1].dt_txt.split(' ')[0]) {
          forecastDays.push(data.list[i]);

        } else {
          renderForecast(forecastDays);
          forecastDays = [];
          forecastDays.push(data.list[i]);
        }
      }
    }

    if (document.querySelectorAll('.day').length === 4) {
      renderForecast(forecastDays);
    }
  });
}

function renderForecast(array) {
  if (array.length === 0) {
    return;
  }

  const forecastEl = document.querySelector('.forecast');
  const weekday = fixDateToWeekday(array[0].dt_txt);
  const lastElement = array.length - 1;
  const sortedArray = array.sort((a, b) => {
    return a.main.temp - b.main.temp;
  });
  let timeDescription;

  array.forEach(forecast => {
    if (forecast.dt_txt.includes('15:00:00')) {
      timeDescription = forecast;
    }
  });

  forecastEl.insertAdjacentHTML('beforeend', `
    <div class="day">
      <h3>${weekday}</h3>
      <img src="http://openweathermap.org/img/wn/${timeDescription.weather[0].icon}@2x.png" />
      <div class="description">${timeDescription.weather[0].description}</div>
      <div class="temp">
        <span class="high">${sortedArray[lastElement].main.temp}℃</span>/<span class="low">${sortedArray[0].main.temp}℃</span>
      </div>
    </div>`);
}