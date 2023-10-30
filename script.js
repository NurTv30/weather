const apiKey = "2eee17853bd4ec7efb4a707bf56d0b32";

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при получении данных о погоде:", error);
    }
}

async function getFiveDayForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при получении данных о прогнозе:", error);
    }
}

function displayCurrentWeather(data) {
    const currentWeather = document.getElementById("currentWeather");
    currentWeather.innerHTML = `
        <h3>Сегодня (${new Date().toLocaleDateString()})</h3>
        <p>Температура: ${data.main.temp} °C</p>
        <p>Ощущается как: ${data.main.feels_like} °C</p>
        <p>Рассвет: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Закат: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
        <p>Длительность дня: ${Math.floor((data.sys.sunset - data.sys.sunrise) / 3600)} часов</p>
    `;
}

function displayOtherWeather(data) {
    const otherWeather = document.getElementById("otherWeather");
    otherWeather.innerHTML = `
        <h3>Детальная информация</h3>
        <p>Влажность: ${data.main.humidity}%</p>
        <p>Давление: ${data.main.pressure} гПа</p>
        <p>Ветер: ${data.wind.speed} м/с</p>
        <p>Облачность: ${data.clouds.all}%</p>
    `;
}

async function displayPopularCitiesTemperatures() {
    const popularCities = document.getElementById("popularCities");
    popularCities.innerHTML = `
        <h3>Температуры в популярных городах</h3>
        <p>Алматы: ${await getTemperatureForCity("Almaty")} °C</p>
        <p>Астана: ${await getTemperatureForCity("Astana")} °C</p>
        <p>Атырау: ${await getTemperatureForCity("Atyrau")} °C</p>
        <p>Актау: ${await getTemperatureForCity("Aktau")} °C</p>
    `;
}

async function getTemperatureForCity(city) {
    const data = await getWeather(city);
    if (data && data.cod === 200) {
        return data.main.temp;
    } else {
        return "N/A"; 
    }
}

function displayShortForecast(data) {
    const forecastCards = document.getElementById("forecastCards");
    forecastCards.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;
        const icon = forecast.weather[0].icon;

        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <h3>${dayOfWeek}</h3>
            <p>${date.toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/w/${icon}.png" alt="${description}">
            <p>Температура: ${temperature} °C</p>
            <p>${description}</p>
        `;

        card.onclick = () => {
            displayDetailedForecast(forecast);
        };

        forecastCards.appendChild(card);
    }
}

function displayDetailedForecast(forecast) {
    const detailedForecast = document.getElementById("detailedForecast");
    const date = new Date(forecast.dt * 1000);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const temperature = forecast.main.temp;
    const description = forecast.weather[0].description;
    const icon = forecast.weather[0].icon;
    const humidity = forecast.main.humidity;
    const pressure = forecast.main.pressure;
    const windSpeed = forecast.wind.speed;
    const clouds = forecast.clouds.all;

    detailedForecast.innerHTML = `
        <h3>${dayOfWeek}, ${date.toLocaleDateString()}</h3>
        <img src="https://openweathermap.org/img/w/${icon}.png" alt="${description}">
        <p>Температура: ${temperature} °C</p>
        <p>${description}</p>
        <p>Влажность: ${humidity}%</p>
        <p>Давление: ${pressure} гПа</p>
        <p>Ветер: ${windSpeed} м/с</p>
        <p>Облачность: ${clouds}%</p>
    `;
}

async function searchWeather() {
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value;

    if (city.trim() === "") {
        alert("Введите название города.");
        return;
    }

    const weatherData = await getWeather(city);

    if (weatherData && weatherData.cod === 200) {
        displayCurrentWeather(weatherData);
        displayOtherWeather(weatherData);
    } else {
        alert("Город не найден.");
    }
}

async function searchFiveDayForecast() {
    const forecastCityInput = document.getElementById("forecastCityInput");
    const city = forecastCityInput.value;

    if (city.trim() === "") {
        alert("Введите название города для прогноза на 5 дней.");
        return;
    }

    const forecastData = await getFiveDayForecast(city);

    if (forecastData && forecastData.cod === "200") {
        displayShortForecast(forecastData);
    } else {
        alert("Прогноз не найден.");
    }
}

function openTab(tabName) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

openTab("today");
searchWeather();
displayPopularCitiesTemperatures();
