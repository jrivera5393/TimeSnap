//Name of the local storage variable name for the array of stop watches
var currStopwatches = "currStopwatches";

function Stopwatch(container, storageId, oldWatch) {
    this.storageId = storageId;
    this.interval = oldWatch ? oldWatch.interval : 0;
    this.clock = $(container).find(".clock");
    this.digits = $(this.clock).find('span');
    this.startButton = $(container).find("#stopwatch-btn-start");
    this.pauseButton = $(container).find("#stopwatch-btn-pause");
    this.resetButton = $(container).find("#stopwatch-btn-reset");
    this.beginingTimestamp = oldWatch ? oldWatch.beginingTimestamp : 0;
    this.runningTime = oldWatch ? oldWatch.runningTime : 0;

    var self = this;
    this.startButton.on('click',function(){
        var clock = $(self.clock);
        if(clock.hasClass('inactive')){
            self.start();
        }
        self.hideStart();
    });

    this.pauseButton.on('click',function(){
        self.pause();
        self.hidePause();
    });

    this.resetButton.on('click',function(){
        self.reset();
        self.hidePause();
    });

    this.startButton.on('click',function(){
        var clock = $(self.clock);
        if(clock.hasClass('inactive')){
            self.start();
        }
        self.hideStart();
    });

    this.clock.click(function(){
        var div = $(this);
        if(div.hasClass("inactive")){
            self.start();
            self.hideStart();
        }else{
            self.pause();
            self.hidePause();                    
        }
    });

    this.clock.on('mouseenter', function (e) {
		$(this).addClass('z-depth-3');
	});

	this.clock.on('mouseleave', function (e) {
		$(this).removeClass('z-depth-3');
	});
}

Stopwatch.prototype = {    
    start : function(){
        // Prevent multiple intervals going on at the same time.
        clearInterval(this.interval);
        
        var clock = $(this.clock);
        var digits = clock.find('span');

        var startTimestamp = new Date().getTime(), runningTime = 0;

        this.beginingTimestamp = startTimestamp;

        // The app remembers for how long the previous session was running.
        if(Number(this.runningTime)){
            runningTime = Number(this.runningTime);
        }
        else{
            this.runningTime = 1;
        }

        // Every 100ms recalculate the running time, the formula is:
        // time = now - when you last started the clock + the previous running time
        this.interval = setInterval(function () {
            var stopwatchTime = (new Date().getTime() - startTimestamp + runningTime);
            digits.text(returnFormattedToMilliseconds(stopwatchTime));
        }, 100);

        clock.removeClass('inactive');

        localStorage.setItem(this.storageId, JSON.stringify(this));
    },
    pause : function(){
        // Stop the interval.
        clearInterval(this.interval);

        if(Number(this.beginingTimestamp)){
            // On pause recalculate the running time.
            // new running time = previous running time + now - the last time we started the clock.
            var runningTime = Number(this.runningTime) + new Date().getTime() - Number(this.beginingTimestamp);

            this.beginingTimestamp = 0;
            this.runningTime = runningTime;

            var clock = $(this.clock);
            clock.addClass('inactive');
        }

        localStorage.setItem(this.storageId, JSON.stringify(this));
    },
    reset : function(){
        clearInterval(this.interval);
        var digits = $(this.digits);
        var clock = $(this.clock);

        digits.text(returnFormattedToMilliseconds(0));
        this.beginingTimestamp = 0;
        this.runningTime = 0;

        clock.addClass('inactive');

        localStorage.setItem(this.storageId, JSON.stringify(this));
    },
    hideStart : function(){
        var btnPause = $(this.pauseButton);
        var btnStart = $(this.startButton);

        btnStart.hide();
        btnPause.show();
    },
    hidePause : function(){
        var btnPause = $(this.pauseButton);
        var btnStart = $(this.startButton);

        btnPause.hide();
        btnStart.show();  
    }
};

function getStopwatches(componentUrl, stopwatchContainer){
    
    var arrStopwatches = localStorage.getItem(currStopwatches) ? JSON.parse(localStorage.getItem(currStopwatches)) : [];

    for(var i = 0; i < arrStopwatches.length; i++){        
        var storageId = arrStopwatches[i];
        setStopwatch(storageId, componentUrl, stopwatchContainer);       
    }    
}

function setStopwatch(storageId, componentUrl, stopwatchContainer){
    //Use existing local storage id or create a new one using current date and time
    storageId = storageId ? storageId : "sw" + new Date().getDate() + new Date().getTime();  

    $.get(componentUrl, {storageId : storageId}, function(data){
        var container = $(stopwatchContainer);
        container.append(data);

        var control = $("#" + storageId);

        var stopwatch;
        var arrStopwatches = localStorage.getItem(currStopwatches) ? JSON.parse(localStorage.getItem(currStopwatches)) : [];   
        var stopwatchStorage = localStorage.getItem(storageId);

        if(!stopwatchStorage){
            stopwatch = new Stopwatch(control, storageId);
            arrStopwatches.push(storageId);
            localStorage.setItem(currStopwatches, JSON.stringify(arrStopwatches));
        }else{
            var oldStopwatch = JSON.parse(stopwatchStorage);
            stopwatch = new Stopwatch(control, storageId, oldStopwatch);
        }

        // Checks if the previous session was ended while the stopwatch was running.
        // If so start it again with according time.
        if(Number(stopwatch.beginingTimestamp) && Number(stopwatch.runningTime)){

            var runningTime = Number(stopwatch.runningTime) + new Date().getTime() - Number(stopwatch.beginingTimestamp);

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
    var milliseconds = Math.floor((time % 1000) / 100),
        seconds = Math.floor((time/1000) % 60),
        minutes = Math.floor((time/(1000*60)) % 60),
        hours = Math.floor((time/(1000*60*60)) % 24);

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;


    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function returnTimeObject(time){
    
    var result = {
        milliseconds : Math.floor((time % 1000) / 100),
        seconds : Math.floor((time/1000) % 60),
        minutes : Math.floor((time/(1000*60)) % 60),
        hours : Math.floor((time/(1000*60*60)) % 24)
    };

    return result;
}