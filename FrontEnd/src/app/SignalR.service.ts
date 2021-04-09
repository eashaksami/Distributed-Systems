import { RatingModel, UserModel } from './DataModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: UserModel[];
  public bradcastedData: UserModel[];

  private hubConnection: signalR.HubConnection;

  constructor(private http: HttpClient) { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:5001/client')
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }


  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      var dat = JSON.stringify(data);
      console.log("Broadcasted Data: " + dat);
      // console.log("Parsign started")
      var users: UserModel[] = JSON.parse(dat);
    
      this.sendRating(users);
      // console.log("print finished");
    })
  }

  sendRating(userData: UserModel[]){
      
    console.log("sending rating");
    var ratingInfo: RatingModel[] = new Array();
    
    for(var i = 0; i < userData.length; i+=2)
    {
      let info = {driverName: userData[i].name, riderName: userData[i+1].name, rating: +(Math.random() * (5 - 1 + 1)).toFixed(1)};
      ratingInfo.push(info);
    }

    this.http.put('https://localhost:5001/api/ClientBot', ratingInfo)
    .subscribe();
  }
}
