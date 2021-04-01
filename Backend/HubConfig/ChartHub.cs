using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using DS_Lab.Models;
using Microsoft.AspNetCore.SignalR;

namespace DS_Lab.HubConfig
{
    public static class UserHandler
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
        public static Queue myQueue = new Queue();
    }
    public class ChartHub : Hub
    {
        // public async Task BroadcastChartData(ChartModel data) => await Clients.All.SendAsync("broadcastchartdata", data);
        // public async Task BroadcastChartData(ChartModel data, string connectionId) 
        // => await Clients.Client(connectionId).SendAsync("broadcastchartdata", data);

        public void BroadcastChartData(ChartModel data, string connectionId)
        {
            Queue clientids = UpdateQueue(connectionId);
            var t = Task.Run(async delegate
            {
                await Task.Delay(10000);
                await Clients.Client(clientids.Dequeue().ToString()).SendAsync("broadcastchartdata", clientids);

            });
            t.Wait();
            Clients.Client(clientids.Dequeue().ToString()).SendAsync("broadcastchartdata", clientids);
        }

        // public void BroadcastDriverData(ChartModel data, string connectionId)
        // {
        //     Queue clientids = UpdateQueue(connectionId);
        //     var t = Task.Run(async delegate
        //     {
        //         await Task.Delay(50000);
        //         await Clients.Client(clientids.Dequeue().ToString()).SendAsync("broadcastchartdata", clientids);

        //     });
        //     t.Wait();
        //     // await Clients.Client(clientids.Dequeue().ToString()).SendAsync("broadcastchartdata", clientids);
        // }


        public string GetConnectionId() => Context.ConnectionId;

        public string getId()
        {
            string id = UserHandler.myQueue.Dequeue().ToString();
            return id;
        }

        List<string> connections = new List<string>();
        public List<string> storeRequests(string ConnectionId)
        {
            this.connections.Add(ConnectionId);
            return connections;
        }

        public Queue UpdateQueue(string ConnectionId)
        {
            UserHandler.myQueue.Enqueue(ConnectionId);
            return UserHandler.myQueue;
        }

        // public override Task OnConnectedAsync()
        // {
        //     UserHandler.ConnectedIds.Add(Context.ConnectionId);
        //     return base.OnConnectedAsync();
        // }

        // public override Task OnDisconnectedAsync(Exception exception)
        // {
        //     UserHandler.ConnectedIds.Remove(Context.ConnectionId);
        //     return base.OnDisconnectedAsync(exception);
        // }
        
    }
}