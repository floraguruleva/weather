const API_DATA = {
    end_point: `https://api.openweathermap.org/data/2.5/`,
    key: `3a6f44099971d9435dc4d16be3528871`
}
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const data = document.querySelector(`#data`);
data.addEventListener(`keypress`, enterData);

let tl = gsap.timeline();
tl.from(".container-input", { yPercent: "-200", delay: 0.5, duration: 1, ease: "back.out" })
    .from(".block-background", { opacity: 0, yPercent: "100", delay: 0.5, duration: 1, ease: "back.out", stagger: 0.3 }, "<+=0.3");

function getIP(json) {
    getCurrentLocation(json.ip);
}

async function getCurrentLocation(ip) {
    const data = await fetch(`https://ipinfo.io/${ip}?token=ff424f4f68f34a`);
    const dataJson = await data.json();
    showCurrentLocationWeather(dataJson.city);
}

function showCurrentLocationWeather(city) {
    data.value = city;
    getData(city);
}

function enterData(e) {
    if (e.keyCode === 13) {
        getData(data.value);
    }
}

async function getData(city) {
    const data = await fetch(`${API_DATA.end_point}weather?q=${city}&appid=${API_DATA.key}&units=metric`);
    if (data.status === 404) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Sorry, city not found'
        })
        return;
    }
    const dataJson = await data.json();

    showResult(dataJson);
}

function showResult(data) {
    const place = document.querySelector(`#place`);
    place.textContent = `${data.name},${data.sys.country}`;

    const temp = document.querySelector(`#temp`);
    temp.textContent = `${Math.round(data.main.temp)}°`;

    const max = document.querySelector(`#max`);
    max.textContent = `${Math.round(data.main.temp_max)}°`;

    const min = document.querySelector(`#min`);
    min.textContent = `${Math.round(data.main.temp_min)}°`;

    const feelsLike = document.querySelector(`#feelsLike`);
    feelsLike.textContent = `feels like: ${Math.round(data.main.feels_like)}°`;

    const description = document.querySelector(`#description`);
    description.textContent = `${data.weather[0].main}`;

    const icon = document.querySelector(`#iconWeather`);
    icon.src = getIcon(data.weather[0].icon);

    const date = document.querySelector(`#date`);
    date.textContent = getDate();

    const wind = document.querySelector(`#wind`);
    wind.textContent = `${data.wind.speed} m/s`;
}

function getDate() {
    const myDate = new Date();

    let dayOfWeek = DAYS[myDate.getDay()];
    let hours = myDate.getHours();
    let minutes = myDate.getMinutes();
    let currentDate = myDate.getDate();
    let currentMonth = myDate.getMonth();
    let currentYear = myDate.getFullYear();
    return `${currentMonth}/${currentDate}/${currentYear}, ${dayOfWeek}, ${hours}:${minutes}`
}

function getIcon(code) {
    return `http://openweathermap.org/img/wn/${code}@2x.png`
}