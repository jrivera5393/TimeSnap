using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeSnap.Models;

namespace TimeSnap.ViewComponents
{
    public class TaskListViewComponent: ViewComponent
    {
        private readonly TimeSnapContext db;

        public TaskListViewComponent(TimeSnapContext context)
        {
            db = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long entryId)
        {
            var tasks = await db.Tasks.Where(x => x.TimeEntryId == entryId).ToListAsync();
            return View(tasks);
        }
    }
}