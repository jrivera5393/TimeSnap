using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TimeSnap.Models;

namespace TimeSnap.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }       

        public IActionResult GetComponent(string storageId)
        {
            return ViewComponent("StopWatch", new { storageId = storageId });
        }        
    }
}
