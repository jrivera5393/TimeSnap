using System;
using System.Collections.Generic;

namespace TimeSnap.Models
{
    public class Task
    {
        public long TaskId { get; set; }
        public string Type {get;set;}
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }

        public long TimeEntryId { get; set; }
        public TimeEntry TimeEntry { get; set; }
    }
}