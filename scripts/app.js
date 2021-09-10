const cityForm = document.querySelector(".change-location");
const cityName = document.querySelector("#city-name");
const weatherCondition = document.querySelector("#weather-condition h4");
const temp = document.querySelector("#temp");
const card = document.querySelector('.card');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');
const datetime = document.querySelector('#date-time');
const forecast = new Forecast();

const updateUI = ({ cityDetails, weather }) => {

	//update details template
	cityName.textContent = `${cityDetails.LocalizedName}-${cityDetails.AdministrativeArea.ID}, ${cityDetails.AdministrativeArea.CountryID}`;
	weatherCondition.textContent = weather.WeatherText;
	temp.textContent = weather.Temperature.Metric.Value;
	let textDtTime = weather.LocalObservationDateTime;
	textDtTime = `Updated: ${textDtTime.substr(8, 2)}/${textDtTime.substr(5, 2)}/${textDtTime.substr(0, 4)} ${textDtTime.substr(11, 2)}:${textDtTime.substr(14, 2)}`
	datetime.textContent = textDtTime;

	//update the night/day and icon images
	const timeSrc = weather.IsDayTime ? 'img/day.svg' : 'img/night.svg';
	time.setAttribute('src', timeSrc);

	const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
	icon.setAttribute('src', iconSrc);

	//show card if it's hidden
	if (card.classList.contains('d-none')) {
		card.classList.remove('d-none');
	}
}

cityForm.addEventListener("submit", (e) => {
	// prevent default action
	e.preventDefault();

	//update city value
	const city = cityForm.city.value;
	cityForm.reset();

	//update UI with new city
	forecast.updateCity(city).then((data) => {
		console.log(data);
		updateUI(data);
	});

	// set local storage
	localStorage.city = city;
});

if (localStorage.city) {
	forecast.updateCity(localStorage.city).then((data) => {
		updateUI(data);
	});
};
