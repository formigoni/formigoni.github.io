class Forecast {
	constructor() {
		this.key = "qcjc2nuzsRWQxRcR4FlYqxXQ4CmAxuoz";
		this.weatherURI =
			"http://dataservice.accuweather.com/currentconditions/v1/";
		this.cityURI =
			"http://dataservice.accuweather.com/locations/v1/cities/search";
	}
	async updateCity(cityName) {
		const cityDetails = await this.getCity(cityName);
		const weather = await this.getWeather(cityDetails.Key);
		return { cityDetails, weather };
	}

	// get city information. Receiving city name
	async getCity(cityName) {
		const query = `?apikey=${this.key}&q=${cityName}&language=pt-br`;

		const response = await fetch(this.cityURI + query);
		const data = await response.json();
		return data[0];
	}

	// get weather information. Receives city id
	async getWeather(cityId) {
		const query = `${cityId}?apikey=${this.key}&language=pt-br&details=true`;

		const response = await fetch(this.weatherURI + query);
		const data = await response.json();
		console.log(data);
		return data[0];
	}
}

const test = () => {
	const forecast = new Forecast();
	forecast
		.getCity("Curitiba")
		.then((cityData) => {
			console.log(cityData);
			return forecast.getWeather(cityData.Key);
		})
		.then((weatherData) => {
			console.log(weatherData);
		})
		.catch((err) => {
			console.log("error: " + err);
		});
};

test();