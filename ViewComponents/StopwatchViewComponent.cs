using Microsoft.AspNetCore.Mvc;  
using System.Threading.Tasks;  
using TimeSnap.Models;  
using System.Collections.Generic;
using System.Linq;

namespace TimeSnap.ViewComponents  
{   
    [ViewComponent(Name = "StopWatch")]  
    public class StopwatchViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(string storageId) {
            var stopwatch = new Models.Stopwatch();
            stopwatch.StorageId = storageId;

            return View(stopwatch);
        }        
    }
}
