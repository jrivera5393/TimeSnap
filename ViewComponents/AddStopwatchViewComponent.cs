using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace TimeSnap.ViewComponents
{
    public class AddStopwatchViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View();
        }
    }
}