import { Component, NgZone } from '@angular/core';
import { City } from '../city';
import { cityList } from './citiesList'
import { Errors } from './errorMessages'

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent{

  city: City = {};
  errorMessage: string;
  playEnd: boolean;

  namedCities: City[] = [
    {name: 'Минск', author: true},
    {name: 'Калининград', author: false},
    {name: 'Денвер', author: true},
    {name: 'Рио-Де-Жанейро', author: false}
  ];

  constructor(private zone: NgZone) {
    this.names = cityList;
  }

  play(cityName: string) {
    const lastCity = this.namedCities[this.namedCities.length - 1];
    if(lastCity.author){
      this.errorMessage = Errors.ERROR_ORDER;
    } else if(this.namedCities.includes(cityName)) {
      this.errorMessage = Errors.ERROR_RULE_VIOLATION_REPEAT;
    } else if(cityName[0].toLowerCase() !=
      lastCity.name[lastCity.name.length - 1].toLowerCase()) {
      this.errorMessage = Errors.ERROR_RULE_VIOLATION_LETTER;
    } else {
      this.errorMessage = null;
      this.city.name = "";
      this.namedCities.push(this.userPlays(cityName);
      this.namedCities.push(this.compPlays(this.namedCities));
    }
  }

  userPlays(cityName: string) {
    const city: City {
      name: cityName.trim(),
      author: true
    };
    return city;
  }

  compPlays(namedCities: string[]): City{
    var lastCityName = namedCities[namedCities.length - 1].name;
    var lastLetter = lastCityName[lastCityName.length - 1];
    var nextCity;
    do{
      nextCity = this.names[lastLetter.toUpperCase()].pop();
      if(!nextCity) {
        this.playEnd = true;
        return {
          name: "",
          author: true
        };
      }
    } while (nextCity && this.isNamed(nextCity, namedCities));
    return {
      name: nextCity,
      author: false
    };
  }

  isNamed(nextCity: string, namedCities: string[]) {
    return namedCities.filter((city) => {return city.name == nextCity}).length;
  }

  nameCity(): void {
      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      this.speechRecognition = new webkitSpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.lang = 'ru-RU';
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onresult = speech => {
        if (speech.results) {
            var result = speech.results[speech.resultIndex];
            var transcript = result[0].transcript;
            if (result.isFinal) {
              if (result[0].confidence < 0.3) {
                console.log("Unrecognized result - Please try again");
              }
              else {
                console.log("Did you said? -> " + transcript);
                this.zone.run(() => {
                  this.city.name = transcript;
                  const city: City {
                    id: 4,
                    name: transcript,
                    author: true
                  };
                  this.citiesList.push(city);
                });
              }
            }
          }
        };

        this.speechRecognition.start();
        console.log("Say something");
      };

}
