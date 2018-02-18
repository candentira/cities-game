import { Component, OnInit, NgZone } from '@angular/core';
import { City } from '../city';

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  const ERROR_ORDER: string = "Сейчас не ваша очередь!";
  const ERROR_RULE_VIOLATION_LETTER: string = "Название города должно начинаться " +
    "на последнюю букву названия последнего названного города!";
  const ERROR_RULE_VIOLATION_REPEAT: string = "Нельзя называть уже ранее " +
    "названные города!";

  city: City = {};
  errorMessage: string;

  citiesList: City[] = [
    {name: 'Минск', author: true},
    {name: 'Калининград', author: false},
    {name: 'Денвер', author: true},
    {name: 'Рио-Де-Жанейро', author: false}
  ];

  constructor(private zone: NgZone) { }

  ngOnInit() {
  }

  play(cityName: string) {
    const lastCity = this.citiesList[this.citiesList.length - 1];
    if(lastCity.author){
      this.errorMessage = this.ERROR_ORDER;
    } else if(this.citiesList.includes(cityName)) {
      this.errorMessage = this.ERROR_RULE_VIOLATION_REPEAT;
    } else if(cityName[0].toLowerCase() !=
      lastCity.name[lastCity.name.length - 1].toLowerCase()) {
      this.errorMessage = this.ERROR_RULE_VIOLATION_LETTER;
    } else {
      this.userPlays(cityName);
      this.citiesList.push(this.compPlays(this.citiesList));
    }
  }

  userPlays(cityName: string) {
    const city: City {
      name: cityName.trim(),
      author: true
    };
    this.city.name = "";
    this.citiesList.push(city);
  }

  compPlays(citiesList: string[]): City{
    return {
      name: "Новый город",
      author: false
    };;
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
