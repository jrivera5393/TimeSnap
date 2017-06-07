/* jshint esversion: 6 */

//Name of the local storage variable name for the array of stop watches
const currStopwatches = "currStopwatches";

function getStopwatches(componentUrl, stopwatchContainer){
    
    $.getJSON("api/TimeEntry", function(entries){
        let arrStopwatches = localStorage.getItem(currStopwatches) ? JSON.parse(localStorage.getItem(currStopwatches)) : [];        

        // for(var i = 0; i < arrStopwatches.length; i++){        
        //     var storageId = arrStopwatches[i];
        //     setStopwatch(storageId, componentUrl, stopwatchContainer);       
        // } 

        for(let i = 0; i < entries.length; i++){
            let entry = entries[i];
            setStopwatch(entry.StorageId, componentUrl, stopwatchContainer, entry.TimeEntryId); 
        }
    });     
}

function setStopwatch(storageId, componentUrl, stopwatchContainer, entryId){

    if(entryId){
        //if storageId is lready being passed as an argument
        //get current time entry from DB
        $.getJSON("api/TimeEntry", {id : entryId}, function(entry){
            getStopwatchComponent(componentUrl, stopwatchContainer, storageId);
        });

    }else{
        //create a new one using current date and time
        let dataType = 'application/json; charset=utf-8';
        let data = {
            StorageId : "sw" + new Date().getDate() + new Date().getTime(),
            ProjectId : 1           
        };

       

        $.ajax({
            type: 'POST',
            url: 'api/TimeEntry',
            dataType: 'json',
            contentType: dataType,
            data: JSON.stringify(data),
            success: function(result) {
                getStopwatchComponent(componentUrl, stopwatchContainer, storageId, result.TimeEntryId);
            }
        });        
    }              
}

function getStopwatchComponent(componentUrl, stopwatchContainer, storageId){
    $.getJSON(componentUrl, {storageId : storageId}, function(data){
            let container = $(stopwatchContainer);
            container.append(data);

            let control = $("#" + storageId);

            let stopwatch;
            let arrStopwatches = localStorage.getItem(currStopwatches) ? JSON.parse(localStorage.getItem(currStopwatches)) : [];   
            let stopwatchStorage = localStorage.getItem(storageId);

            if(!stopwatchStorage){
                stopwatch = new Stopwatch(control, storageId);
                arrStopwatches.push(storageId);
                localStorage.setItem(currStopwatches, JSON.stringify(arrStopwatches));
            }else{
                let oldStopwatch = JSON.parse(stopwatchStorage);
                stopwatch = new Stopwatch(control, storageId, oldStopwatch);
            }

            // Checks if the previous session was ended while the stopwatch was running.
            // If so start it again with according time.
            if(Number(stopwatch.beginingTimestamp) && Number(stopwatch.runningTime)){

                let runningTime = Number(stopwatch.runningTime) + new Date().getTime() - Number(stopwatch.beginingTimestamp);

                stopwatch.runningTime = runningTime;
                stopwatch.start();
                stopwatch.hideStart();
            }

            // If there is any running time form previous session, write it on the clock.
            // If there isn't initialise to 0.
            if(stopwatch.runningTime){
                $(stopwatch.digits).text(returnFormattedToMilliseconds(Number(stopwatch.runningTime)));            
            }
            else{
                stopwatch.runningTime = 0;
                stopwatch.hidePause();
            }		

            localStorage.setItem(storageId, JSON.stringify(stopwatch));

            control.addClass("scale-in");
        });
}

function returnFormattedToMilliseconds(time){
    let milliseconds = Math.floor((time % 1000) / 100),
        seconds = Math.floor((time/1000) % 60),
        minutes = Math.floor((time/(1000*60)) % 60),
        hours = Math.floor((time/(1000*60*60)) % 24);

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function returnTimeObject(time){
    
    let result = {
        milliseconds : Math.floor((time % 1000) / 100),
        seconds : Math.floor((time/1000) % 60),
        minutes : Math.floor((time/(1000*60)) % 60),
        hours : Math.floor((time/(1000*60*60)) % 24)
    };

    return result;
}

export default {getStopwatches, setStopwatch, getStopwatchComponent, returnFormattedToMilliseconds, returnTimeObject};