import { Injectable } from "@angular/core";
import { ChartModel } from "./ChartModel";
import * as signalR from "@microsoft/signalr"; 
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
  })
  export class SignalRService {
    public data: ChartModel[];
    public connectionId : string;
    public bradcastedData: ChartModel[];

    constructor() { }

    private hubConnection: signalR.HubConnection

    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('https://localhost:5001/chart')
                              .build();
      return this.hubConnection
        .start()
        .then(() => console.log('Connection started'))
        .then(() => this.getConnectionId())
        .catch(err => console.log('Error while starting connection: ' + err))
    }

    public getConnectionId = () => {
      this.hubConnection.invoke('getconnectionid').then(
        (data) => {
          console.log("ConnectionId: " + data);
          this.connectionId = data;
        }
      ); 
    }

    public broadcastChartData = (lat: number, long: number, name: string) => {
      const data = {
        lat: lat,
        lang: long,
        name: name
      };
      console.log(data);
      this.hubConnection.invoke('broadcastchartdata')
      .catch(err => console.error(err));
    }

    public addBroadcastChartDataListener = () => {
      this.hubConnection.on('transferchartdata', (data) => {
        console.log("Received Data: " + data);
        this.bradcastedData = data;
      });
    }
  }