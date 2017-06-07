using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TimeSnap.Models;

namespace TimeSnap.Controllers
{
    [Route("api/[controller]")]
    public class TimeEntryController : Controller
    {
        private readonly TimeSnapContext db;

        public TimeEntryController(TimeSnapContext context)
        {
            db = context;            
        }

        [HttpGet]
        public IEnumerable<TimeEntry> GetAll()
        {
            return db.TimeEntries.ToList();
        }

        [HttpGet("{id}", Name = "GetTimeEntry")]
        public IActionResult GetById(long id)
        {
            var item = db.TimeEntries.FirstOrDefault(t => t.TimeEntryId == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        [HttpPost]
        public IActionResult Create([FromBody] TimeEntry entry)
        {
            if(entry == null){
                return BadRequest();
            }

            entry.StartDate = DateTime.Now;
            entry.EndDate = DateTime.Now;
            entry.Status = Constants.TimeEntryStatus.Active;
            
            db.TimeEntries.Add(entry);
            db.SaveChanges();

            return CreatedAtRoute("GetTimeEntry", new { id = entry.TimeEntryId }, entry);
        }

        [HttpPatch("{id}")]
        public IActionResult Update(long id, [FromBody] TimeEntry entry)
        {
            if (entry == null || entry.TimeEntryId != id)
            {
                return BadRequest();
            }

            var oldEntry = db.TimeEntries.FirstOrDefault(t => t.TimeEntryId == id);
            if (oldEntry == null)
            {
                return NotFound();
            }

            //Update entry with the posted entry
            oldEntry.Hours = entry.Hours;
            oldEntry.Minutes = entry.Minutes;
            oldEntry.Seconds = entry.Seconds;
            oldEntry.BeginingTimestamp = entry.BeginingTimestamp;
            oldEntry.RunningTime = entry.RunningTime;
            oldEntry.Status = Constants.TimeEntryStatus.Active;
            oldEntry.EndDate = entry.EndDate;
            oldEntry.StorageId = entry.StorageId;

            db.TimeEntries.Update(oldEntry);
            db.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            var entry = db.TimeEntries.First(t => t.TimeEntryId == id);
            if (entry == null)
            {
                return NotFound();
            }

            db.TimeEntries.Remove(entry);
            db.SaveChanges();

            return new NoContentResult();
        }

        
    }
}