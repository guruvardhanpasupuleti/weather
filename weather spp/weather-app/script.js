
// ============================================================
// Weather Forecast App — OpenWeatherMap API (requires API key)
// ============================================================

// Your API key
const API_KEY = "e6c3cc2034a33c4ee9a6e0a785d198f2";

// Get the HTML elements we need
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const weatherCard = document.getElementById("weather-card");

// 1. Runs when the form is submitted
function searchWeather(event) {
  event.preventDefault(); // stop the page from reloading

  const city = cityInput.value.trim();
  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  showLoading();
  fetchWeather(city);
}

// 2. Fetches weather data from the API using fetch() and JSON
async function fetchWeather(city) {
  try {
    // One request is enough: OpenWeatherMap finds the city by name
    const url =
      "https://api.openweathermap.org/data/2.5/weather" +
      "?q=" + encodeURIComponent(city) +
      "&units=metric" + // temperature in Celsius
      "&appid=" + API_KEY;

    const response = await fetch(url);
    const data = await response.json();

    // OpenWeatherMap returns code 404 when the city is unknown
    if (data.cod === "404") {
      showError("City not found. Please check the spelling and try again.");
      return;
    }
    // Invalid API key returns code 401
    if (data.cod === "401") {
      showError("Invalid API key. Please check your key in script.js.");
      return;
    }

    displayWeather(data);
  } catch (error) {
    // Network problem or unexpected error
    showError("Something went wrong. Please try again later.");
  }
}

// 3. Puts the fetched data on the page
function displayWeather(data) {
  // The JSON from OpenWeatherMap looks like:
  // { name: "London", sys: { country: "GB" },
  //   main: { temp: 19.2, humidity: 69 },
  //   wind: { speed: 2.5 },
  //   weather: [ { description: "overcast clouds", icon: "04d" } ] }

  document.getElementById("city-name").textContent = data.name;
  document.getElementById("country").textContent = data.sys.country;
  document.getElementById("temperature").textContent =
    Math.round(data.main.temp) + "°C";
  document.getElementById("condition").textContent =
    data.weather[0].description;
  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("wind").textContent = data.wind.speed + " m/s";

  // OpenWeatherMap serves ready-made icons by icon code (e.g. "04d")
  document.getElementById("weather-icon").src =
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

  // Hide messages, show the card
  hideAll();
  weatherCard.classList.remove("hidden");
}

// 4. Helper: show an error message
function showError(message) {
  hideAll();
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

// Helper: show the loading message
function showLoading() {
  hideAll();
  loadingEl.classList.remove("hidden");
}

// Helper: hide card, error, and loading messages
function hideAll() {
  loadingEl.classList.add("hidden");
  errorEl.classList.add("hidden");
  weatherCard.classList.add("hidden");
}

// Connect the form to searchWeather()
searchForm.addEventListener("submit", searchWeather);
