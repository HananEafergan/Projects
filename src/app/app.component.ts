import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/Forms';

import { Weather, WeatherDTO } from '../shared/weather.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WeatherApp';
  result: Weather[] = [];
  cityArr: string[] = ['Ramat Gan', 'Tel Aviv', 'Moscow', 'Toronto', 'Detroit', 'Paris'];
  weatherForm: FormGroup = this.formBuilder.group({
    cityWeather: this.formBuilder.array([this.getForm()])
  })


  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {
  }

  get cityWeather() {
    return this.weatherForm.controls["cityWeather"] as FormArray;
  }

  private getForm(): FormGroup {
    return this.formBuilder.group({
      city: ['', Validators.required],
      unit: ['', Validators.required]
    });
  }

  public getResults(i: number): void {
    const city = (this.cityWeather.controls[i] as FormGroup).controls.city.value;
    const unit = (this.cityWeather.controls[i] as FormGroup).controls.unit.value;
    this.httpClient.get("http://api.openweathermap.org/data/2.5/weather?q=" + city
      + "&APPID=d7065f5c2ec83481abbbdabfb3792687&units=" + unit).subscribe(data => {
        this.result.push(
          {
            city: (data as WeatherDTO).name,
            temp: (data as WeatherDTO).main.temp,
            icon: (data as WeatherDTO).weather[0].icon,
            main: (data as WeatherDTO).weather[0].main,
            unit: unit
          }
        )
      }
      );
  }

  public addCity(i: number): void {
    if (!this.weatherForm.valid) {
      return;
    }
    this.getResults(i);
    this.cityWeather.push(this.getForm());
  }

  public removeCity(i: number): void {
    this.cityWeather.removeAt(i);
    this.result.splice(i);
  }

  public getIcon(i: number): string {
    return "http://openweathermap.org/img/wn/" + this.result[i].icon + ".png";
  }

  public getTempUnit(i: number): string {
    switch (this.result[i].unit.toLowerCase()) {
      case 'imperial':
        return '°F';
      case 'metric':
        return '°C';
      default:
        return 'K';
    }
  }
}