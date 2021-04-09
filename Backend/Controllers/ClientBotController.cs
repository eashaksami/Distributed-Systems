using System;
using System.Collections.Generic;
using Backend.Data;
using Backend.HubConfig;
using Backend.Models;
using Backend.Scheduler;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientBotController : ControllerBase
    {
        private IHubContext<ClientHub> _hub;
        private readonly DataContext _context;

        public ClientBotController(IHubContext<ClientHub> hub, DataContext context)
        {
            _context = context;
            _hub = hub;
        }

        public IActionResult AddRider([FromQuery] string lat, [FromQuery] string lang, [FromQuery] string name)
        {
            double Lat = double.Parse(lat);
            double Lang = double.Parse(lang);
            var rider = new DataModel
            {
                lat = Lat,
                lang = Lang,
                name = name
            };
            UserHandler.riderList.Add(rider);

            if (UserHandler.message.Count == 0)
            {
                UserHandler.message.Add("sami");
                var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("broadcastchartdata", getPairs()));
            }

            return Ok(new { Message = "Driver Request Completed" });
        }

        [HttpGet("{driver}")]
        public IActionResult AddDriver([FromQuery] string lat, [FromQuery] string lang, [FromQuery] string name)
        {
            double Lat = double.Parse(lat);
            double Lang = double.Parse(lang);
            var driver = new DataModel
            {
                lat = Lat,
                lang = Lang,
                name = name
            };
            UserHandler.driverList.Add(driver);

            return Ok(new { Message = "Driver Request Completed" });
        }

        [HttpPut]
        public IActionResult StoreRating([FromBody] Ratings[] model)
        {

            foreach (var rating in model)
            {
                _context.Ratings.Add(rating);
                _context.SaveChanges();
            }

            return Ok();
        }

        private List<DataModel> getPairs()
        {
            var riders = UserHandler.riderList;
            var drivers = UserHandler.driverList;
            var pairs = new List<DataModel>();

            double minDistance = 99999999;
            int position = 0, j = 0;

            for (int m = riders.Count - 1; m >= 0; m--)
            {
                if (drivers.Count > 0)
                {
                    int i = 0;
                    for (int n = 0; n < drivers.Count; n++)
                    {
                        double distance = Math.Sqrt((Math.Pow((drivers[n].lat - riders[m - riders.Count + 1].lat), 2))
                            + (Math.Pow((drivers[n].lang - riders[m - riders.Count + 1].lang), 2)));

                        if (distance < minDistance)
                        {
                            minDistance = distance;
                            position = i;
                        }
                        i++;
                    }
                }
                riders[0].fare = minDistance * 2;
                drivers[position].fare = minDistance * 2;
                pairs.Add(riders[0]);
                pairs.Add(drivers[position]);
                // ListPair.Add(pairs);
                // pairs.Add(new List<ChartModel> { riders[0], drivers[position] });
                // pairs.Clear();
                drivers.RemoveAt(position);
                riders.RemoveAt(0);

                position = 0;
                minDistance = 9999999;
                j++;
            }
            return pairs;
        }
    }

    public static class UserHandler
    {
        public static List<DataModel> riderList = new List<DataModel>();
        public static List<DataModel> driverList = new List<DataModel>();
        public static List<string> message = new List<string>();
    }
}
