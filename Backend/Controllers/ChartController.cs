using System;
using Backend.Services;
using DS_Lab.DataStorage;
using DS_Lab.HubConfig;
using DS_Lab.Models;
using DS_Lab.TimerFeatures;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DS_Lab.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChartController : ControllerBase
    {
        private IHubContext<ChartHub> _hub;
        public ChartController(IHubContext<ChartHub> hub)
        {
            _hub = hub;
        }
        public IActionResult Get()
        {
            // var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("transferchartdata", DataManager.GetData()));
            return Ok(new { Message = "Request Completed" });
        }

        [HttpGet("{rider}")]
        public IActionResult GetRider([FromQuery] string lat, [FromQuery] string lang, [FromQuery] string name, [FromQuery] string connectionId)
        {
            // var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("transferchartdata", DataManager.GetData()));
            double Lat = double.Parse(lat);
            double Lang = double.Parse(lang);
            var rider = new ChartModel
            {
                lat = Lat,
                lang = Lang,
                name = name,
                connectionId = connectionId
            };
            var info = SendDataService.BroadcastChartData(rider);
            string str = "\nRider Info: \n" + "name: " + info[0].name + "\nLat: " + info[0].lat + "\nLang: " + info[0].lang;
            str+= "\nDriver Info: \n" + "name: " + info[1].name + "\nLat: " + info[1].lat + "\nLang: " + info[1].lang;
            _hub.Clients.Client(info[0].connectionId).SendAsync("transferchartdata", str);
            _hub.Clients.Client(info[1].connectionId).SendAsync("transferchartdata", str);
            return Ok(new { Message = "Rider Request Completed" });
            
        }

        [HttpGet]
        public IActionResult GetDriver([FromQuery] string lat, [FromQuery] string lang, [FromQuery] string name, [FromQuery] string connectionId)
        {
            double Lat = double.Parse(lat);
            double Lang = double.Parse(lang);
            var driver = new ChartModel
            {
                lat = Lat,
                lang = Lang,
                name = name,
                connectionId = connectionId
            };
            SendDataService.addDriverToList(driver);
            return Ok(new { Message = "Driver Request Completed" });
            
        }   
    }
}