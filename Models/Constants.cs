using System;
using System.Collections.Generic;

namespace TimeSnap.Models
{
    public static class Constants
    {
        public static class ProjectLocation {
            public const string Remote = "Remote";
            public const string Local = "Local";

            public static string[] GetAll(){
                return new []{ Remote, Local };
            }
        }

        public static class ProjectSource {
            public const string ITDG = "ITDG";
            public const string Local = "Local";

            //Add new constants to GetAll method
            public static string[] GetAll(){
                return new []{ ITDG, Local };
            }
        }
    }
}