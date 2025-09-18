const searchBtn = document.getElementById('searchBtn');
const locationInput = document.getElementById('location');

searchBtn.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        
        getCoordinates(location);
    }
});


function getWeather(latitude, longitude) {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let weather = data.current_weather;

            document.getElementById('temp').textContent = `Temperature: ${weather.temperature} °C`;
            document.getElementById('condition').textContent = `Condition: ${weather.weathercode}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.hourly.relative_humidity_2m[0]}%`;
            document.getElementById('wind').textContent = `Wind Speed: ${weather.windspeed} km/h`;
            
            fetchWeatherData(weather.weathercode);
        })
        .catch(error => {
            console.error("Error fetching weather:", error);
        });
    
}

function getCoordinates(location) {
    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                let lat = data[0].lat;
                let lon = data[0].lon;

                getWeather(lat, lon); 

            } else {
                alert("Location not found. Try again!");
            }
        })
        .catch(error => console.error("Error fetching coordinates:", error));
}

async function fetchWeatherData(weathercode) {
    try {
        const response = await fetch("weather.json"); 
        const data = await response.json(); 

        if (weathercode !== undefined) {  

            let idx = "" + weathercode;  
            let val=(data[idx]);
            console.log(val);
        
            document.getElementById("day").textContent = `Day: ${val.day.description}`;
            document.getElementById("night").textContent= `Night: ${val.night.description}`;
            document.getElementById("dayImage").setAttribute("src", `${val.day.image}`);
            document.getElementById("nightImage").setAttribute("src", `${val.night.image}`);
        }

    } catch (error) {

        console.error("Error loading weather data:", error);
    }
}



