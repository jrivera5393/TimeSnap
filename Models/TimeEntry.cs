using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TimeSnap.Models
{
    public class TimeEntry
    {
        [Key]
        public long TimeEntryId { get; set; }
        public long BeginingTimestamp {get;set;}
        public long RunningTime {get;set;}        
        public int Hours { get; set; }
        public int Minutes { get; set; }
        public int Seconds { get; set; }
        public int Milliseconds { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public long UpdateDate {get;set;}
        public string Status {get;set;}
        public string StorageId {get;set;}

        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}