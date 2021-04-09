import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SignalRService } from './SignalR.service';
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  
  constructor(public signalRService: SignalRService, private http: HttpClient) { }

  ngOnInit() {

    this.signalRService.startConnection();
    this.signalRService.addBroadcastChartDataListener();
    setInterval(()=> {
      this.startHttpRequest();
      }, 1000);
  }

  private startHttpRequest = () => {
    const config: Config = {
      dictionaries: [names]
    }
    const params = new HttpParams()
                        .set('lat', ((Math.random() * 100) + 1).toString())
                        .set('lang', ((Math.random() * 100) + 1).toString())
                        .set('name', uniqueNamesGenerator(config));
    this.http.get('https://localhost:5001/api/ClientBot', {params})
      .subscribe(res => {
        console.log(res);
      });
    
    this.addDriver(config);
  }

  addDriver(config: Config){
    const params = new HttpParams()
                        .set('lat', ((Math.random() * 100) + 1).toString())
                        .set('lang', ((Math.random() * 100) + 1).toString())
                        .set('name', uniqueNamesGenerator(config));
    this.http.get('https://localhost:5001/api/ClientBot/driver', {params})
      .subscribe(res => {
        console.log(res);
      });
  }
}
