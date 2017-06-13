using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TimeSnap.Models;

namespace TimeSnap.Controllers
{
    [Route("api/[controller]")]
    public class TaskController : Controller
    {
        private readonly TimeSnapContext db;

        public TaskController(TimeSnapContext context)
        {
            db = context;            
        }

        [HttpGet("{id}", Name = "GetTasks")]
        public IEnumerable<Models.Task> GetAllByTimeEntry(long id)
        {
            return db.Tasks.Where(x => x.TimeEntryId == id).ToList();
        }

        [HttpGet("id/{id}", Name = "GetTask")]
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
        public IActionResult Create([FromBody] Models.Task task)
        {
            if(task == null){
                return BadRequest();
            }

            task.CreatedDate = DateTime.Now;            
            
            db.Tasks.Add(task);
            db.SaveChanges();

            return CreatedAtRoute("GetTask", new { id = task.TaskId }, task);
        }

        [HttpPatch("{id}")]
        public IActionResult Update(long id, [FromBody] Models.Task task)
        {
            if (task == null || task.TaskId != id)
            {
                return BadRequest();
            }

            var oldTask = db.Tasks.FirstOrDefault(t => t.TaskId == id);
            if (oldTask == null)
            {
                return NotFound();
            }

            //Update entry with the posted entry
            oldTask.Description = task.Description;
            oldTask.Type = task.Type;            

            db.Tasks.Update(oldTask);
            db.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            var task = db.Tasks.First(t => t.TaskId == id);
            if (task == null)
            {
                return NotFound();
            }

            db.Tasks.Remove(task);
            db.SaveChanges();

            return new NoContentResult();
        }
    }
}