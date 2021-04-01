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
    // .then(() => this.chartClicked());
    }, 1000);
  }

  public startHttpRequest = () => {
    const params = new HttpParams()
                        .set('lat', ((Math.random() * 100) + 1).toString())
                        .set('lang', ((Math.random() * 100) + 1).toString())
                        .set('name', "Sami")
                        .set('connectionId', (this.signalRService.connectionId));
    console.log("Rider Data: " + params.toString());
    this.http.get('https://localhost:5001/api/chart/rider', {params})
      .subscribe(res => {
        console.log(res);
      })
  }
  
  public chartClicked = () => {
    var lat = (Math.random() * 100) + 1;
    var long = (Math.random() * 100) + 1;
    // this.signalRService.broadcastChartData(lat, long, "Sami");
  }

}
