import { Component, OnInit } from '@angular/core';
import { SignalRService } from './SignalRService';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(public signalRService: SignalRService, private http: HttpClient) { }
  ngOnInit() {
    setInterval(()=> { 
      this.signalRService.startConnection()
      .then(() => this.startHttpRequest())
      .then(() => this.signalRService.addBroadcastChartDataListener());
      }, 1000);
  }

  private startHttpRequest = () => {
    const params = new HttpParams()
                        .set('lat', ((Math.random() * 100) + 1).toString())
                        .set('lang', ((Math.random() * 100) + 1).toString())
                        .set('name', "Ahsan")
                        .set('connectionId', (this.signalRService.connectionId));
    console.log("Driver Data: " + params.toString());
    this.http.get('https://localhost:5001/api/chart', {params})
      .subscribe(res => {
        console.log(res);
      })
  }

}
