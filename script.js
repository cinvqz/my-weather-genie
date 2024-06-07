const apiKey = '75c181255f73a71af37e054cdf606506';

document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    const errorMessage = document.getElementById('error-message');
    
    if (city === '') {
        errorMessage.textContent = 'Please enter a city name.';
        errorMessage.classList.remove('hidden');
    } else {
        errorMessage.classList.add('hidden');
        fetchWeather(city);
        addToSearchHistory(city);
        saveSearchHistory(city);
    }
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(data) {
    const currentWeather = data.list[0];
    const weatherHTML = `
        <div class="weather-card">
            <h2>${data.city.name}</h2>
            <p>Date: ${currentWeather.dt_txt}</p>
            <img class="weather-icon" src="https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">
            <p>Temperature: ${currentWeather.main.temp}°C</p>
            <p>Humidity: ${currentWeather.main.humidity}%</p>
            <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
        </div>
    `;
    document.getElementById('current-weather').innerHTML = weatherHTML;
}

function displayForecast(data) {
    let forecastHTML = '<h3>5-Day Forecast</h3>';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        forecastHTML += `
            <div class="weather-card">
                <p>Date: ${forecast.dt_txt}</p>
                <img class="weather-icon" src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
                <p>Temperature: ${forecast.main.temp}°C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <p>Wind Speed: ${forecast.wind.speed} m/s</p>
            </div>
        `;
    }
    document.getElementById('forecast').innerHTML = forecastHTML;
}

function addToSearchHistory(city) {
    const cityBtn = document.createElement('button');
    cityBtn.textContent = city;
    cityBtn.classList.add('city-btn');
    cityBtn.addEventListener('click', function() {
        fetchWeather(city);
    });
    document.getElementById('search-history').appendChild(cityBtn);
}

function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

function loadSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach(city => addToSearchHistory(city));
}

// Load search history on page load
document.addEventListener('DOMContentLoaded', loadSearchHistory);
