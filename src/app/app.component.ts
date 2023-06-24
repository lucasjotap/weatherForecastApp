import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface WeatherData {
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    windspeed: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relativehumidity_2m: number[];
    windspeed_10m: number[];
  };
  hourly_forecast: {
    time: string;
    temperature: number;
    humidity: number;
    windspeed: number;
  }[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'weather-app';
  forecastJSON: WeatherData | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.getWeatherForecast(latitude, longitude);
        },
        error => {
          console.error(error);
          // Provide fallback values or error handling
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Provide fallback values or error handling
    }
  }

  getWeatherForecast(latitude: number, longitude: number): void {
    // API URL with dynamically updated latitude and longitude
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;

    this.http.get<WeatherData>(apiUrl).subscribe(
      response => {
        this.forecastJSON = response;
        this.handleForecastData();
      },
      error => {
        console.error(error);
      }
    );
  }

  handleForecastData(): void {
    if (this.forecastJSON) {
      const {
        latitude,
        longitude,
        current_weather: { temperature, windspeed },
        hourly: { time, temperature_2m, relativehumidity_2m, windspeed_10m }
      } = this.forecastJSON;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log("Temperature:", temperature);
      console.log("Windspeed:", windspeed);

      for (let i = 0; i < 1; i++) {
        console.log("Time:", time[i]);
        console.log("Temperature 2m:", temperature_2m[i]);
        console.log("Relative Humidity 2m:", relativehumidity_2m[i]);
        console.log("Windspeed 10m:", windspeed_10m[i]);
      }
    }
  }
}
