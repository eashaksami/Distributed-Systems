import { Injectable } from "@angular/core";
import { ChartModel } from "./ChartModel";
import * as signalR from "@microsoft/signalr"; 

@Injectable({
    providedIn: 'root'
  })
  export class SignalRService {
    public data: ChartModel;
    public bradcastedData: ChartModel;
    public connectionId : string;

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
          console.log(data);
          this.connectionId = data;
        }
      );
    }

    // public addTransferChartDataListener = () => {
    //   this.hubConnection.on('transferchartdata', (data) => {
    //     this.data = data;
    //     console.log(data);
    //   });
    // }

    public broadcastChartData = (lat: number, long: number, name: string) => {
      const data = {
        lat: lat,
        lang: long,
        name: name
      };
      console.log(data);
      this.hubConnection.invoke('broadcastdriverdata', data, this.connectionId)
      .catch(err => console.error(err));
    }

    public addBroadcastChartDataListener = () => {
      this.hubConnection.on('transferchartdata', (data) => {
        console.log(data);
        this.bradcastedData = data;
      });
    }

  }