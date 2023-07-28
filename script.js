const APIKey = "e80efecd42c82421d3b3d3726f179c2a";

// Function to fetch weather data and update the UI
function fetchWeather(city) {
  const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

  fetch(queryURL)
    .then(response => response.json())
    .then(data => {
      // Convert temperature from Kelvin to Celsius
      const temperatureCelsius = (data.main.temp - 273.15).toFixed(1);
      // Update the UI with the current weather information
      const weatherInfo = document.querySelector(".weather-info");
      weatherInfo.innerHTML = `
        <div class="current-weather">
          <h2 id="city-name">${data.name}</h2>
          <p id="date">${new Date(data.dt * 1000).toDateString()}</p>
          <p id="temperature">Temperature: ${temperatureCelsius} °C</p>
          <p id="humidity">Humidity: ${data.main.humidity}%</p>
          <p id="wind-speed">Wind Speed: ${data.wind.speed} m/s</p>
          <img id="weather-icon" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">
        </div>
        <div class="forecast">
          <h3>Forecast for the next days</h3>
          <ul id="forecast-list">
            <!-- Forecast data will be dynamically added here -->
          </ul>
        </div>
      `;

      // Fetch the forecast data for the next 4 days
      fetchForecast(city);
    })
    .catch(error => {
      console.log("Error fetching weather data:", error);
      alert("Unable to fetch weather data. Please try again.");
    });
}

// Function to fetch forecast data for the next 4 days
function fetchForecast(city) {
  const forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

  fetch(forecastURL)
    .then(response => response.json())
    .then(data => {
      // Update the UI with the forecast data for the next 5 days
      const forecastList = document.getElementById("forecast-list");
      forecastList.innerHTML = ""; // Clear existing data

      for (let i = 0; i < data.list.length; i += 8) {
        const forecastData = data.list[i];
        const date = new Date(forecastData.dt * 1000).toDateString();
        const temperatureCelsius = (forecastData.main.temp - 273.15).toFixed(1);
        const humidity = `Humidity: ${forecastData.main.humidity}%`;
        const windSpeed = `Wind Speed: ${forecastData.wind.speed} m/s`;
        const iconCode = forecastData.weather[0].icon;
        const iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <h4>${date}</h4>
          <p>Temperature: ${temperatureCelsius} °C</p>
          <p>${humidity}</p>
          <p>${windSpeed}</p>
          <img src="${iconURL}" alt="Weather Icon">
        `;
        forecastList.appendChild(listItem);
      }
    })
    .catch(error => {
      console.log("Error fetching forecast data:", error);
    });
}

// Function to handle search button click
function handleSearch() {
  const city = document.getElementById("city-input").value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  // Fetch weather data for the entered city
  fetchWeather(city);

  // Save the city to the search history in localStorage
  saveToSearchHistory(city);

  // Clear the input field after search
  document.getElementById("city-input").value = "";
}

// Function to save the city to the search history in localStorage
function saveToSearchHistory(city) {
  // Retrieve the existing search history from localStorage or initialize an empty array
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Add the city to the search history and save it in localStorage
  searchHistory.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  // Update the search history list in the UI
  updateSearchHistoryUI(searchHistory);
}

// Function to update the search history list in the UI
function updateSearchHistoryUI(searchHistory) {
  const searchHistoryList = document.getElementById("search-history-list");
  searchHistoryList.innerHTML = "";

  // Add each city from the search history to the list
  searchHistory.forEach(city => {
    const listItem = document.createElement("li");
    listItem.textContent = city;
    listItem.addEventListener("click", () => handleHistoryCityClick(city)); // Fetch weather data on click
    searchHistoryList.appendChild(listItem);
  });
}

// Function to handle click on a city in the search history
function handleHistoryCityClick(city) {
  // Fetch weather data for the selected city
  fetchWeather(city);
}

// Attach click event to the search button
document.getElementById("search-btn").addEventListener("click", handleSearch);

// On page load, retrieve the search history from localStorage and update the UI
document.addEventListener("DOMContentLoaded", () => {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  updateSearchHistoryUI(searchHistory);

  // If there are cities in the search history, display the weather for the most recent city
  if (searchHistory.length > 0) {
    const mostRecentCity = searchHistory[searchHistory.length - 1];
    fetchWeather(mostRecentCity);
  }
});
