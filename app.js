const today = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const Http = new XMLHttpRequest();

let weather = {
    // Replace with your own api.
    apiKey: "",
    fetchWeather: function(city) {
        fetch(
                "http://api.openweathermap.org/data/2.5/weather?q=" +
                city +
                "&units=imperial&appid=" +
                this.apiKey
            )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found. Please try again.")
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: data => {
        const { name } = data;
        const { temp, temp_min, temp_max, humidity } = data.main;
        const { speed } = data.wind;
        const { main, icon } = data.weather[0];
        const date = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
        document.querySelector('.city').innerText = name;
        document.getElementById('day').innerText = days[today.getDay()];
        document.getElementById('date').innerText = date;
        document.getElementById('temp').innerText = "Temp: " + Math.round(temp) + " °F";
        document.getElementById('max_temp').innerText = "Max: " + Math.round(temp_max) + " °F";
        document.getElementById('min_temp').innerText = "Min: " + Math.round(temp_min) + " °F";
        document.getElementById('wind_speed').innerText = "Wind Speed: " + speed + "km/h";
        document.getElementById('description').innerText = main;
        document.getElementById('humidity').innerText = "Humidity: " + humidity;
        document.getElementById('icon').src = "http://openweathermap.org/img/wn/" + icon + ".png"
    },
};



document.querySelector('.search_button').addEventListener('click', search);
document.querySelector('.search_bar').addEventListener('keyup', function(event) {
    if (event.key == 'Enter') {
        search();
    }
});

function search() {
    const searchCity = document.querySelector('.search_bar').value
    weather.fetchWeather(searchCity);
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + searchCity + "')";
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getApi(bdcApi + "?" + latitude + +"&" + longitude + "&localityLanguage=en");
        });
    } else {
        weather.fetchWeather('New York');
    }
}

getLocation();

function getApi(bdcApi) {
    Http.open("GET", bdcApi);
    Http.send();
    Http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            weather.fetchWeather((JSON.parse(this.responseText).locality));
        }
    };
}
