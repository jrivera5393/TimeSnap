using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TimeSnap.Models
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string Source { get; set; }
        public DateTime CreatedDate { get; set; }

        public List<TimeEntry> TimeEntries { get; set; }      
    }
}